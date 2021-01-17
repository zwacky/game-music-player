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
			.map((item, index) => ({index, file: item.file}))
			.filter(item => track && item.file === track.file)
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

	/**
	 * returns a track by its name.
	 * if none could be found, a random track will be returned.
	 */
	static getTrackByName(file: string): Track {
		const selectedTracks = this.data.tracks
			.filter(track => track.file.indexOf(`${file}.m4a`) !== -1);
		return (selectedTracks.length > 0) ?
			selectedTracks[0] :
			this.getNextTrack(null);
	}

	static getTracksByIds(trackIds: string[]): Track[] {
		return (!trackIds) ?
			[] :
			this.data.tracks
				.filter(track => trackIds.indexOf(track.file.substr(0, track.file.length-4)) !== -1);
	}

}
