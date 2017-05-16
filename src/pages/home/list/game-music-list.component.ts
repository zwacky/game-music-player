import { Component, Input } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app/app.state';
import { GameMusicProvider } from "./game-music.provider";
import * as firebase from 'firebase';
import { Track } from "../../../common/player/track.interface";
import { PlayerActions } from "../../../common/player/player.actions";
import { HomeActions } from "../home.actions";
import { getCurrentTrack, isTracklistDownloaded, getFaveIds } from "../../../common/player/player.selectors";
import { ListSource } from "./list-source.enum";
import { StorageManager } from "../../../common/storage/storage-manager.provider";


@Component({
	selector: 'game-music-list',
	template: `
		<ion-list>
			<game-music-list-item
				*ngFor="let track of bufferedTracks; let idx = index"
				[track]="track"
				[isSelected]="(currentTrack$ | async)?.trackName === track.trackName"
				[idx]="idx">
			</game-music-list-item>
		</ion-list>

		<!--
		<ion-list [virtualScroll]="bufferedTracks" approxItemHeight="48px">
			<div *virtualItem="let track; let idx = index" style="width: 100%;">
				<game-music-list-item
					[track]="track"
					[isSelected]="(currentTrack$ | async)?.trackName === track.trackName"
					[idx]="idx">
				</game-music-list-item>
			</div>
		</ion-list>
		-->
	`
})
export class GameMusicList {

	@Input() listSource: ListSource;

	currentTrack$: Observable<Track>;
	private listDownloaded$: Observable<boolean>;
	private faveIds$: Observable<string[]>;

	private tracksData = GameMusicProvider.data;
	private bufferedTracks: Track[] = [];
	private selectedTrack: Track;

	constructor(
		private http: Http,
		private location: Location,
		private store: Store<AppState>,
		private playerActions: PlayerActions,
		private homeActions: HomeActions,
		private storeManager: StorageManager,
	) {
		this.currentTrack$ = this.store.select(getCurrentTrack);
		this.listDownloaded$ = this.store.select(isTracklistDownloaded);
		this.faveIds$ = this.store.select(getFaveIds);

		// decide if the track is selected
		// this.currentTrack$
		// 	.filter(currentTrack => !!currentTrack)
		// 	.subscribe(currentTrack => this.selectedTrack = currentTrack);
	}

	ngOnInit() {
		if (this.listSource === ListSource.ALL) {
			this.loadTracks()
				.subscribe(tracks => {
					this.tracksData.tracks = tracks;
					this.bufferedTracks = tracks;

					// check if there is a track in the url already to play initially
					const wantedTrackName = this.location.path()
						.replace('/', ''); // remove the slashes
					const track = (!wantedTrackName) ?
						GameMusicProvider.getRandomTrack() :
						GameMusicProvider.getTrackByName(wantedTrackName);

					this.store.dispatch(this.playerActions.selectTrack(track));
					this.store.dispatch(this.playerActions.setListDownloaded());
				});
		} else if (this.listSource === ListSource.FAVES) {
			this.listDownloaded$
				.filter(Boolean)
				.subscribe(faveIds => {
					this.faveIds$
						.subscribe(faveIds => {
							this.bufferedTracks = GameMusicProvider.getTracksByIds(faveIds);
						});
				});
		}
	}

	private loadTracks() {
		return new Observable<Array<Track>>(observer => {
			firebase.database().ref('/tracks')
				.once('value')
				.then(snapshot => {
					const result = Object.keys(snapshot.val())
						.map(key => snapshot.val()[key]);
					observer.next(result);
					observer.complete();
				});
		});
	}

}
