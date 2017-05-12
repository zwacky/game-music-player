import { Component } from '@angular/core';
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
import { getCurrentTrack } from "../../../common/player/player.selectors";


@Component({
	selector: 'game-music-list',
	template: `
		<ion-list [virtualScroll]="bufferedTracks">
			<div *virtualItem="let track; let idx = index" style="width: 100%;" approxItemHeight="48px">
				<game-music-list-item
					[track]="track"
					[isSelected]="selectedTrack?.trackName === track.trackName"
					[idx]="idx">
				</game-music-list-item>
			</div>
		</ion-list>
	`
})
export class GameMusicList {

	// public musicControl$: Observable<MusicControl>;
	public currentTrack$: Observable<Track>;

	private tracksData = GameMusicProvider.data;
	private bufferedTracks: Track[] = [];
	private selectedTrack: Track;

	constructor(
		public http: Http,
		private store: Store<AppState>,
		private playerActions: PlayerActions,
		private homeActions: HomeActions,
		private location: Location,
	) {
		this.currentTrack$ = this.store.select(getCurrentTrack);

		this.loadTracks()
			.subscribe(tracks => {
				this.tracksData.tracks = tracks;
				this.bufferedTracks = tracks;

				// check if there is a track in the url already to play initially
				const wantedTrackName = location.path()
					.replace('/', ''); // remove the slashes
				const track = (!wantedTrackName) ?
					GameMusicProvider.getRandomTrack() :
					GameMusicProvider.getTrackByName(wantedTrackName);
				this.store.dispatch(this.playerActions.selectTrack(track));
			});

		// decide if the track is selected
		this.currentTrack$
			.filter(currentTrack => !!currentTrack)
			.subscribe(currentTrack => this.selectedTrack = currentTrack);
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
