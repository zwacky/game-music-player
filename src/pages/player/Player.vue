<template>
	<ion-page>
		<ion-header>
			<NavBar></NavBar>
		</ion-header>

		<ion-content style="height: calc(100vh - 56px - 61px)">
			<PlayerTrackList></PlayerTrackList>
		</ion-content>

		<ion-footer>
			<PlayerControl></PlayerControl>
		</ion-footer>
	</ion-page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';
import NavBar from '@/common/components/navbar/NavBar.vue';
import PlayerTrackList from '@/pages/player/PlayerTrackList.vue';
import PlayerControl from '@/pages/player/PlayerControl.vue';

const Player = namespace('player');

@Component({
	components: { NavBar, PlayerTrackList, PlayerControl },
})
export default class extends Vue {
	@Player.Action loadTracks;

	created() {
		this.loadTracks([]);
	}
}
</script>

<style lang="scss">
</style>
