import firebase from 'firebase/app';
import 'firebase/database';
import { Track } from '@/pages/track.interface';

const firebaseConfig = {
	apiKey: 'AIzaSyD-qlduY4Mu89iXzch-OosGjf0dPb5zFLI',
	authDomain: 'game-music-player.firebaseapp.com',
	databaseURL: 'https://game-music-player.firebaseio.com',
	storageBucket: 'game-music-player.appspot.com',
	messagingSenderId: '26986259894',
};

firebase.initializeApp(firebaseConfig);

const FirebaseHelper = {
	getLiveVersion() {
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
	},
	/**
	 * fetches tracks from the firebase db and also caches it in localStorage.
	 */
	fetchTracks(): Promise<Track[]> {
		return firebase
			.database()
			.ref('/tracks')
			.once('value')
			.then(snapshot => {
				const val = snapshot.val();
				const result = Object.keys(val).map(key => val[key]);
				return result;
			});
	}
}

export default FirebaseHelper;