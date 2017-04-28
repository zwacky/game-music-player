import { Track } from "../../../common/player/track.interface";

export interface ITrackData {
	tracks: Array<Track>
};

export class GameMusicProvider {

	static data: ITrackData = {
		tracks: []
	};

	static getRandomTrack(): Track {
		return this.data.tracks[Math.floor(Math.random() * this.data.tracks.length)]
	}

	/**
	 * gets the next track in the list after the passed track.
	 *
	 * @param track currentTrack
	 */
	static getNextTrack(track: Track | null): Track {
		const currentTrackIndex = this.data.tracks
			.map((item, index) => ({index, trackName: item.trackName}))
			.filter(item => track && item.trackName === track.trackName)
			.concat([null])
			.map(item => item ? item.index : null)
			[0];
		const nextTrackIndex = (currentTrackIndex !== null && currentTrackIndex + 1 < this.data.tracks.length) ?
			currentTrackIndex + 1 :
			0;
		return this.data.tracks
			.filter((item, index) => index === nextTrackIndex)
			.concat([null])
			[0];

	}

}
