<template>
	<ion-button class="navbar-music-control--active" @click="openVolumeSlider($event)">
		<ion-icon slot="icon-only" name="volume-high" v-if="volume != 0"></ion-icon>
		<ion-icon slot="icon-only" name="volume-off" v-else></ion-icon>
	</ion-button>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Getter, namespace } from 'vuex-class';
import NavBarVolumeSliderPopover from './NavBarVolumeSliderPopover.vue';

const Settings = namespace('settings');

@Component
export default class NavBarVolumeSlider extends Vue {
	@Settings.Getter volume;

	async openVolumeSlider(event: Event) {
		this['$ionic'].popoverController
			.create({
				component: {
					parent: this,
					render: h => h(NavBarVolumeSliderPopover),
				},
				translucent: true,
				event,
			})
			.then(modal => modal.present());
	}
}
</script>