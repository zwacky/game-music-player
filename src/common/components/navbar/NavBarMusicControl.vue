<template>
	<ion-buttons slot="primary" class="navbar-music-control">
		<NavBarVolumeSlider></NavBarVolumeSlider>
		<div>
			<ion-button @click="toggleSetting('isRepeat')" v-toggleClass="{ 'navbar-music-control--active': isRepeat }">
				<ion-icon slot="icon-only" name="repeat"></ion-icon>
			</ion-button>
		</div>
		<ion-button @click="toggleSetting('isShuffle')" v-toggleClass="{ 'navbar-music-control--active': isShuffle }">
			<ion-icon slot="icon-only" name="shuffle"></ion-icon>
		</ion-button>
		<ion-button href="https://github.com/zwacky/game-music-player" @click="trackClickout()" target="_blank" rel="noopener" class="navbar-music-control--active" title="Go to GitHub project">
			<ion-icon slot="icon-only" name="logo-github"></ion-icon>
		</ion-button>
	</ion-buttons>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Getter, namespace, Mutation } from 'vuex-class';
import { PlayerStore } from '@/common/stores/player.store';
import NavBarVolumeSlider from './NavBarVolumeSlider.vue';

const Player = namespace('player');
const Settings = namespace('settings');

@Component({
	components: { NavBarVolumeSlider },
})
export default class NavBarMusicControl extends Vue {
	@Player.Getter filteredTracks;
	@Settings.Getter isRepeat;
	@Settings.Getter isShuffle;

	@Settings.Action toggleSetting;

	created() {
		// setInterval(() => {
		// 	console.log('xxx', this.isRepeat);
		// }, 1000);
	}

	trackClickout() {
		console.log('trackClickout');
	}
	
}
</script>

<style lang="scss">
.navbar-music-control {
	ion-button {
		opacity: 0.3;
		transition: opacity 0.25s ease-in-out;
		color: black;
	}

	// ion-button {
	// 	opacity: 0.3;
	// 	transition: opacity 0.25s ease-in-out;
	// 	color: black;
	// }

	&--active {
		// --ion-opacity: 1 !important;
		opacity: 1 !important;
	}
}
</style>
