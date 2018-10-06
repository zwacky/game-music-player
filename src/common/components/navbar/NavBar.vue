<template>
	<ion-toolbar color="primary">
		<ion-buttons slot="start">
			<NavBarLogo></NavBarLogo>
		</ion-buttons>
		<ion-searchbar 
			:value="trackFilter"
			debounce="0" 
			@ionChange="setTrackFilter($event.target.value)" 
			placeholder="Search tracks" 
			style="padding-left: 10px;"
		></ion-searchbar>
		<ion-buttons slot="end">
			<NavBarMusicControl></NavBarMusicControl>
		</ion-buttons>
	</ion-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import NavBarLogo from './NavBarLogo.vue';
import NavBarMusicControl from './NavBarMusicControl.vue';
import { Getter, Action, namespace } from 'vuex-class';

const Player = namespace('player');

@Component({
	components: { NavBarLogo, NavBarMusicControl },
})
export default class extends Vue {
	@Player.Getter trackFilter;
	@Player.Action setTrackFilter;
}
</script>
