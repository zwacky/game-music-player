import Vue from 'vue';
import Vuex from 'vuex';
import { PlayerStore } from '@/common/stores/player.store';
import { SettingsStore } from '@/common/stores/settings.store';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		player: PlayerStore,
		settings: SettingsStore,
	}
});
