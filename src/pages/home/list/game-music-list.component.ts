import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

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
		<ion-list>
			<game-music-list-item
				*ngFor="let track of bufferedTracks"
				[track]="track"
				[isSelected]="selectedTrack?.trackName === track.trackName">
			</game-music-list-item>
		</ion-list>
	`
})
export class GameMusicList {

	// public musicControl$: Observable<MusicControl>;
	public currentTrack$: Observable<Track>;

	private tracksData = GameMusicProvider.data;
	private bufferedTracks: Track[];
	private selectedTrack: Track;

	constructor(
		public http: Http,
		private store: Store<AppState>,
		private playerActions: PlayerActions,
		private homeActions: HomeActions,
	) {
		this.currentTrack$ = this.store.select(getCurrentTrack);

		this.loadTracks()
			.subscribe(tracks => {
				this.tracksData.tracks = tracks;
				this.bufferedTracks = tracks;

				// deferred rendering - saving 1+ sec
				let i = 1;
				const timer = setInterval(() => {
					this.bufferedTracks = tracks.slice(0, i * 16);
					i++;

					if (i * 16 > tracks.length) {
						clearInterval(timer);
						this.store.dispatch(this.homeActions.setRendered(true));
					}
				}, 0);

				// select a track automatically to play
				const randomTrack =  GameMusicProvider.getRandomTrack();
				this.store.dispatch(this.playerActions.selectTrack(randomTrack));
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
