<template>
	<ion-item>
		<ion-range
			min="0"
			max="100"
			step="10"
			snaps="false"
			color="dark"
			:value="volume"
			@ionChange="setVolume($event.target.value)">

			<ion-icon slot="start" name="volume-off" style="padding-right: 10px;"></ion-icon>
			<ion-icon slot="end" name="volume-high" style="padding-left: 10px;"></ion-icon>
		</ion-range>
	</ion-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace, Getter } from 'vuex-class';
import store from '@/store';

const Settings = namespace('settings');

@Component
export default class NavBarVolumeSliderPopover extends Vue {
	@Settings.Getter volume;
	@Settings.Action setVolume;
}
</script>
