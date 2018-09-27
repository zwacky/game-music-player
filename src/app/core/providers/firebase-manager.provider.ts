import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as firebase from 'firebase';
import 'firebase/database';
import { Injectable } from '@angular/core';
import { Observable, defer, BehaviorSubject, interval, of, timer } from 'rxjs';
import { Track } from '../interfaces/track';
import { startWith, map, mergeMap, distinctUntilChanged, filter } from 'rxjs/operators';

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
	private tracks: BehaviorSubject<Track[]> = new BehaviorSubject(null);

	tracks$: Observable<Track[]> = this.tracks.asObservable().pipe(
		filter(s => s !== null),
		distinctUntilChanged()
	);

	constructor() {
		firebase.initializeApp(firebaseConfig);
		// check up-to-dateness of tracks immediately + 1 hour
		timer(0, 60 * 60 * 1000).subscribe(() => this.checkTracks());
	}

	private async checkTracks() {
		const [localVersion, liveVersion] = await this.getVersions();
		const tracks =
			!localVersion || localVersion < liveVersion
				? await this.fetchTracks()
				: JSON.parse(localStorage.getItem(this.FIELD_TRACKS));
		this.tracks.next(tracks);
	}

	/**
	 * get app versions from firebase db.
	 * also sets local version with live veersion.
	 */
	private async getVersions() {
		const localVersion = parseInt(
			'' + (localStorage.getItem(this.FIELD_TRACK_VERSION) || 0),
			10
		);
		const liveVersion = await this.getLiveVersion();
		localStorage.setItem(this.FIELD_TRACK_VERSION, liveVersion + '');

		return [localVersion, liveVersion];
	}

	/**
	 * fetches tracks from the firebase db and also caches it in localStorage.
	 */
	private fetchTracks(): Promise<Track[]> {
		return firebase
			.database()
			.ref('/tracks')
			.once('value')
			.then(snapshot => {
				const val = snapshot.val();
				const result = Object.keys(val).map(key => val[key]);
				// save the tracks in localStorage for caching
				localStorage.setItem(this.FIELD_TRACKS, JSON.stringify(result));
				return result;
			});
	}

	private getLiveVersion() {
		return new Promise<number>((resolve, reject) => {
			firebase
				.database()
				.ref('versions/tracks')
				.once('value')
				.then(snapshot => {
					const liveVersion = snapshot.val() || 0; // should never be 0… ¯\_(ツ)_/¯
					resolve(liveVersion);
				});
		});
	}
}
