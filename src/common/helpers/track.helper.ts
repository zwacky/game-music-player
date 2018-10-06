import { Track } from '@/pages/track.interface';
import StorageHelper from '@/common/helpers/storage.helper';
import FirebaseHelper from '@/common/helpers/firebase.helper';

const FIELD_TRACKS = 'tracks';
const FIELD_TRACK_VERSION = 'trackVersion';

async function getVersions(): Promise<{ live: number; local: number }> {
	const liveVersion = await FirebaseHelper.getLiveVersion();
	const localVersion = parseInt(StorageHelper.getItem(FIELD_TRACK_VERSION) || '0');
	return { live: liveVersion, local: localVersion };
}

const helper = {
	/**
	 * retrieves tracks from localStorage with fallback to firebase db.
	 */
	async getTracks(): Promise<Track[]> {
		let tracks = undefined;
		const { live, local } = await getVersions();
		const rawTracks = StorageHelper.getItem(FIELD_TRACKS);
		// refetch list of tracks when tracks are not locally stored or local version is outdated
		if (!rawTracks || local < live) {
			tracks = await FirebaseHelper.fetchTracks();
			// save the tracks in localStorage for caching
			StorageHelper.setItem(FIELD_TRACKS, JSON.stringify(tracks));
		} else {
			tracks = JSON.parse(rawTracks);
		}
		return tracks || [];
	},
};

export default helper;
