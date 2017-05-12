import { Action } from '@ngrx/store';
import { Track } from "./track.interface";
import { GameMusicProvider } from "../../pages/home/list/game-music.provider";
import { AudioState } from "./player.reducer";


export class PlayerActions {
	static TOGGLE_SETTING = 'TOGGLE_SETTING';
	static SELECT_TRACK = 'SELECT_TRACK';
	static SET_AUDIO_STATE = 'SET_AUDIO_STATE';
	static SET_VOLUME = 'SET_VOLUME';

	toggleSetting(settingKey: string): Action {
		return {
			type: PlayerActions.TOGGLE_SETTING,
			payload: settingKey
		};
	}

	setVolume(volume: number): Action {
		return {
			type: PlayerActions.SET_VOLUME,
			payload: volume
		};
	}

	selectTrack(track: Track): Action {
		return {
			type: PlayerActions.SELECT_TRACK,
			payload: track
		};
	}

	nextTrack(currentTrack: Track, isShuffle: boolean, isRepeat: boolean): Action {
		const track = (isShuffle) ?
			GameMusicProvider.getRandomTrack() :
			GameMusicProvider.getNextTrack(currentTrack);
		return {
			type: PlayerActions.SELECT_TRACK,
			payload: (isRepeat) ?
				currentTrack :
				track
		};
	}

	setAudioState(audioState: AudioState) {
		return {
			type: PlayerActions.SET_AUDIO_STATE,
			payload: audioState
		};
	}

}
