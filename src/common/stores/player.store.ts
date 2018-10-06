import { ActionTree, GetterTree, MutationTree, Module } from 'vuex';
import { Track } from '@/pages/track.interface';
import TrackHelper from '@/common/helpers/track.helper';

interface PlayerState {
	tracks: Track[];
	currentTrack: Track | null;
	elapsedSeconds: number;
	currentTrackWantedSeeker: number;
	currentTrackDuration: number;
	isPlaying: boolean;
	trackFilter: string;
	trackLimit: number;
}

// STATE
const state: PlayerState = {
	tracks: [],
	currentTrack: null,
	elapsedSeconds: 0,
	currentTrackWantedSeeker: 0,
	currentTrackDuration: 0,
	isPlaying: false,
	trackFilter: '',
	trackLimit: 50,
};

// GETTERS
const getters: GetterTree<PlayerState, any> = {
	allTracks: state => state.tracks,
	filteredTracks: state => {
		return state.tracks
			.filter(track =>
				[track.creator, track.title].some(
					str => str.toLowerCase().indexOf(state.trackFilter.toLowerCase()) !== -1
				)
			)
			.splice(0, state.trackLimit);
	},
	currentTrack: state => state.currentTrack,
	elapsedSeconds: state => state.elapsedSeconds,
	currentTrackWantedSeeker: state => state.currentTrackWantedSeeker,
	currentTrackDuration: state => state.currentTrackDuration,
	isPlaying: state => state.isPlaying,
	trackFilter: state => state.trackFilter,
};

// ACTIONS
const actions: ActionTree<PlayerState, any> = {
	loadTracks: async ({ commit }) => {
		const tracks: Track[] = await TrackHelper.getTracks();
		commit('setTracks', tracks);
	},
	// playNextTrack: ({ commit, state, rootGetters }, actionSource = 'none') => {
	// 	console.log('@todo decide on next track (with actionSource)');
	// 	let selectedTrack = null;
	// 	if (rootGetters['settings/isShuffle']) {
	// 		// is shuffled
	// 		const randomTrackIndex = Math.floor(Math.random() * (state.tracks.length - 0));
	// 		selectedTrack = state.tracks[randomTrackIndex];
	// 	} else {
	// 		// is not shuffled
	// 		const trackIndex = state.tracks.indexOf(state.currentTrack);
	// 		selectedTrack = (trackIndex + 1 >= state.tracks.length) ?
	// 			state.tracks[0] :
	// 			state.tracks[trackIndex + 1];
	// 	}
	// 	// randomly select track
	// 	commit('setPlaying', true);
	// 	commit('playTrack', selectedTrack);
	// },
	playTrack: ({ commit, getters }, trackName: string) => {
		const selectedTrack: Track = getters.allTracks
			.find(track => track.trackName === trackName);
		if (selectedTrack) {
			commit('setPlaying', true);
			commit('selectTrack', selectedTrack);
		}
	},
	setTrackFilter: ({ commit }, trackFilter: string) => {
		console.log('@todo tracking', trackFilter);
		commit('setTrackFilter', trackFilter);
	},
	showMoreTracks: ({ commit, state }, evt) => {
		console.log('@todo tracking showMoretracks');
		const trackLimit = state.trackLimit + 50;
		commit('setTrackLimit', trackLimit);
		evt.target.complete();
	},
	setCurrentTrackDuration: ({ commit }, duration: number) => {
		commit('setCurrentTrackDuration', duration);
	},
	setElapsedSeconds: ({ commit }, elapsedSeconds: number) => {
		commit('setElapsedSeconds', elapsedSeconds);
	},
	setPlaying: ({ commit }, isPlaying: boolean) => {
		commit('setPlaying', isPlaying);
	}
};

// MUTATIONS
const mutations: MutationTree<PlayerState> = {
	setTracks: (state, tracks: Track[]) => (state.tracks = tracks),
	selectTrack: (state, track: Track) => (state.currentTrack = track),
	setTrackFilter: (state, trackFilter: string) => (state.trackFilter = trackFilter),
	setCurrentTrackDuration: (state, duration: number) => (state.currentTrackDuration = duration),
	setElapsedSeconds: (state, elapsedSeconds: number) => (state.elapsedSeconds = elapsedSeconds),
	setTrackLimit: (state, trackLimit: number) => (state.trackLimit = trackLimit),
	setPlaying: (state, isPlaying: boolean) => (state.isPlaying = isPlaying),
};

export const PlayerStore: Module<PlayerState, any> = {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
