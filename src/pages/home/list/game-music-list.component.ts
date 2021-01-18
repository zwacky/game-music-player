import { getTrackFilter } from './../../../common/player/player.selectors';
import { Component, Input } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app/app.state';
import { GameMusicProvider } from "./game-music.provider";
import { Track } from "../../../common/player/track.interface";
import { PlayerActions } from "../../../common/player/player.actions";
import { HomeActions } from "../home.actions";
import { getCurrentTrack, isTracklistDownloaded, getFaveIds } from "../../../common/player/player.selectors";
import { ListSource } from "./list-source.enum";
import { StorageManager } from "../../../common/storage/storage-manager.provider";
import '../../../common/rxjs.deps';


@Component({
	selector: 'game-music-list',
	template: `
		<ion-list>
			<game-music-list-item
				*ngFor="let track of bufferedTracks; let idx = index"
				[track]="track"
				[isSelected]="(currentTrack$ | async)?.file === track.file"
				[idx]="idx">
			</game-music-list-item>
		</ion-list>

		<ion-infinite-scroll
			(ionInfinite)="showMoreTracks($event)"
			threshold="100%"
			[enabled]="isInfiniteScrollEnabled()">
			<ion-infinite-scroll-content></ion-infinite-scroll-content>
		</ion-infinite-scroll>
	`
})
export class GameMusicList {

	@Input() listSource: ListSource;

	currentTrack$: Observable<Track>;

	private BUFFERED_ITEM_AMOUNT = 50;
	private BASE = 'https://raw.githubusercontent.com/zwacky/game-music-player/master/tracks';
	private trackLimit = 1;
	private faveTracks: Track[];
	private listDownloaded$: Observable<boolean>;
	private faveIds$: Observable<string[]>;
	private trackFilter$: Observable<string>;
	private trackFilter: string;
	private tracksData = GameMusicProvider.data;
	private bufferedTracks: Track[] = [];
	private FIELD_TRACKS = 'tracks_v2';

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
		this.trackFilter$ = this.store.select(getTrackFilter);

		// decide if the track is selected
		// this.currentTrack$
		// 	.filter(currentTrack => !!currentTrack)
		// 	.subscribe(currentTrack => this.selectedTrack = currentTrack);
	}

	ngOnInit() {
		if (this.listSource === ListSource.ALL) {
			this.loadTracks()
				// .first()
				.subscribe(tracks => {
					this.tracksData.tracks = tracks;
					this.bufferedTracks = this.tracksData.tracks
						.slice(0, this.BUFFERED_ITEM_AMOUNT);

					// in case of an update, don't replay the track.
					// that means there is already a track playing.
					// @todo

					// check if there is a track in the url already to play initially
					const wantedFile = this.location.path()
						.replace('/', ''); // remove the slashes
					const track = (!wantedFile) ?
						GameMusicProvider.getRandomTrack() :
						GameMusicProvider.getTrackByName(wantedFile);

					this.store.dispatch(this.playerActions.selectTrack(track));
					this.store.dispatch(this.playerActions.setListDownloaded());
				});

			// apply filtering to bufferedTracks
			this.trackFilter$
				// .debounceTime(1000)
				.subscribe(trackFilter => {
					// only filter if there has been tracksData already there
					if (this.tracksData.tracks.length > 0) {
						this.trackLimit = 1; // resetting the trackLimit
						this.trackFilter = trackFilter;
						this.addMoreTracks(this.tracksData.tracks);
					}
				});

		} else if (this.listSource === ListSource.FAVES) {
			this.listDownloaded$
				.filter(Boolean)
				.subscribe(faveIds => {
					this.faveIds$
						.subscribe(faveIds => {
							this.faveTracks = GameMusicProvider.getTracksByIds(faveIds);
							this.bufferedTracks = this.faveTracks
								.slice(0, this.BUFFERED_ITEM_AMOUNT);
						});
				});
		}
	}

	showMoreTracks(infiniteScroll) {
		const targetTracks = (this.listSource === ListSource.ALL) ?
			this.tracksData.tracks :
			this.faveTracks;
		this.addMoreTracks(targetTracks);
		infiniteScroll.complete();
	}

	isInfiniteScrollEnabled() {
		return (this.trackLimit * this.BUFFERED_ITEM_AMOUNT) < this.tracksData.tracks.length;
	}

	private addMoreTracks(targetTracks) {
		this.bufferedTracks = targetTracks
			.filter(track => !this.trackFilter || (
				track.game.toLowerCase().indexOf(this.trackFilter.toLowerCase()) !== -1 ||
				track.file.toLowerCase().indexOf(this.trackFilter.toLowerCase()) !== -1
			))
			.slice(0, this.BUFFERED_ITEM_AMOUNT * this.trackLimit);
		this.trackLimit++;
	}

	/**
	 * check to load the tracks from localStorage first and update the cache later again.
	 */
	private loadTracks() {
		return new Observable<Array<Track>>(observer => {
			const tracks = localStorage.getItem(this.FIELD_TRACKS);
			if (tracks) {
				observer.next(JSON.parse(tracks));
			} else {
				this.http.get(`${this.BASE}/tracks.json`).subscribe(result => {
					localStorage.setItem(this.FIELD_TRACKS, JSON.stringify(result.json().tracks));
				});
			}
		});
	}
}
