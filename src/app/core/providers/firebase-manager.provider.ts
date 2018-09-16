import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as firebase from 'firebase';
import 'firebase/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Track } from '../interfaces/track';

export const firebaseConfig = {
	apiKey: 'AIzaSyD-qlduY4Mu89iXzch-OosGjf0dPb5zFLI',
	authDomain: 'game-music-player.firebaseapp.com',
	databaseURL: 'https://game-music-player.firebaseio.com',
	storageBucket: 'game-music-player.appspot.com',
	messagingSenderId: '26986259894',
};

@Injectable()
export class FirebaseManager {
	private FIELD_TRACKS = 'tracks';
	private FIELD_TRACK_VERSION = 'trackVersion';
	private tracks$: Observable<Track[]>;

	constructor() {
		firebase.initializeApp(firebaseConfig);
		this.tracks$ = this.getTracks();
	}

	get tracks(): Observable<Track[]> {
		return this.tracks$;
	}

	private getTracks() {
		return new Observable<Track[]>(observer => {
			// check if track version is the same like in the localStorage
			const tracks = localStorage.getItem(this.FIELD_TRACKS);
			firebase
				.database()
				.ref('versions/tracks')
				.once('value')
				.then(snapshot => {
					const localVersion = parseInt(
						'' + localStorage.getItem(this.FIELD_TRACK_VERSION),
						10
					);
					const liveVersion = snapshot.val() || 0; // should never be 0… ¯\_(ツ)_/¯
					if ((!localVersion && tracks) || localVersion < liveVersion) {
						// track entries are old.
						// update localStorage and refetch `FIELD_TRACKS`.
						this.fetchTracks().then(tracks => {
							observer.next(tracks);
							observer.complete();
						});
					} else {
						observer.complete();
					}
					localStorage.setItem(this.FIELD_TRACK_VERSION, liveVersion);
				});

			if (tracks) {
				observer.next(JSON.parse(tracks));
			} else {
				this.fetchTracks().then(tracks => observer.next(tracks));
			}
		});
	}

	private fetchTracks() {
		return new Promise<Track[]>((resolve, reject) => {
			firebase
				.database()
				.ref('/tracks')
				.once('value')
				.then(snapshot => {
					const val = snapshot.val();
					const result = Object.keys(val).map(key => val[key]);
					resolve(result);
					// save the tracks in localStorage for caching
					localStorage.setItem(this.FIELD_TRACKS, JSON.stringify(result));
				});
		});
	}
}
