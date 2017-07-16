import { PlayerState } from "./player.reducer";
import { AppState } from "../../app/app.state";
import { createSelector } from 'reselect';

export function getPlayerState(state: AppState): PlayerState {
	return state.player;
};

export function fetchVolume(state: PlayerState) {
	return state.volume;
}

export function fetchIsShuffle(state: PlayerState) {
	return state.isShuffle;
}

export function fetchIsRepeat(state: PlayerState) {
	return state.isRepeat;
}

export function fetchIsPlaying(state: PlayerState) {
	return state.isPlaying;
}

export function fetchIsMuted(state: PlayerState) {
	return state.isMuted;
}

export function fetchCurrentTrack(state: PlayerState) {
	return state.currentTrack;
}

export function fetchTracklistDownloaded(state: PlayerState) {
	return state.trackListDownloaded;
}

export function fetchAudioState(state: PlayerState) {
	return state.audioState;
}

export function fetchFaveIds(state: PlayerState) {
	return state.faveIds;
}

export function fetchTrackFilter(state: PlayerState) {
	return state.trackFilter;
}


// *************************** PUBLIC API's ****************************
export const getVolume = createSelector(getPlayerState, fetchVolume);
export const isShuffle = createSelector(getPlayerState, fetchIsShuffle);
export const isRepeat = createSelector(getPlayerState, fetchIsRepeat);
export const isPlaying = createSelector(getPlayerState, fetchIsPlaying);
export const isMuted = createSelector(getPlayerState, fetchIsMuted);
export const getCurrentTrack = createSelector(getPlayerState, fetchCurrentTrack);
export const isTracklistDownloaded = createSelector(getPlayerState, fetchTracklistDownloaded);
export const getAudioState = createSelector(getPlayerState, fetchAudioState);
export const getFaveIds = createSelector(getPlayerState, fetchFaveIds);
export const getTrackFilter = createSelector(getPlayerState, fetchTrackFilter);
