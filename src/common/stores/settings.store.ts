import { ActionTree, GetterTree, MutationTree, Module, ActionContext } from 'vuex';
import { Track } from '@/pages/track.interface';

interface SettingsState {
	volume: number;
	isShuffle: boolean;
	isRepeat: boolean;
	isMuted: boolean;
}

// STATE
const state: SettingsState = {
	volume: 50,
	isShuffle: true,
	isRepeat: false,
	isMuted: false,
};

// GETTERS
const getters: GetterTree<SettingsState, any> = {
	volume: state => state.volume,
	isShuffle: state => state.isShuffle,
	isRepeat: state => state.isRepeat,
	isMuted: state => state.isMuted,
};

// ACTIONS
const actions: ActionTree<SettingsState, any> = {
	toggleSetting(store: ActionContext<SettingsState, any>, settingKey: keyof SettingsState) {
		store.commit('toggleSetting', settingKey);
		console.log('@todo tracking toggleSetting');
	},
	setVolume(store: ActionContext<SettingsState, any>, volume: number) {
		store.commit('setVolume', volume);
		console.log('@todo tracking setVolume (but not here, because it will send too many reqs');
	},
};

// MUTATIONS
const mutations: MutationTree<SettingsState> = {
	toggleSetting: (state, key: keyof SettingsState) => {
		state[key] = !state[key];
	},
	setVolume: (state, volume: number) => (state.volume = volume),
};

export const SettingsStore: Module<SettingsState, any> = {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
