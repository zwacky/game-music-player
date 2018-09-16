import { Injectable } from '@angular/core';
import { SettingsStore } from '../stores/settings.store';
import { Track } from '../interfaces/track';

@Injectable()
export class TrackManager {
	constructor(private settingsStore: SettingsStore) {}

	/**
	 * gets the next track and takes shuffle into account.
	 */
	getNextTrack(tracks: Track[], currentTrack: Track): Track {
		let track: Track = null;
		if (this.settingsStore.state.isShuffle) {
			// is shuffled
			const randomTrackIndex = Math.floor(Math.random() * (tracks.length - 0));
			track = tracks[randomTrackIndex];
		} else {
			// is not shuffled
			const trackIndex = tracks.indexOf(currentTrack);
			track = (trackIndex + 1 >= tracks.length) ?
				tracks[0] :
				tracks[trackIndex + 1];
		}
		return track;
	}
}
