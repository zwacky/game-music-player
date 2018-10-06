<template>
	<div class="playback" v-toggleClass="{ 'playback--shown': true }">
		
		<PlayerControlSeeker 
			:elapsedSeconds="elapsedSeconds"
			:trackDuration="currentTrackDuration"
			@seeked="seeked">
		</PlayerControlSeeker>

		<ion-fab top left edge class="playback--fab" @click="setPlaying(!isPlaying)">
			<ion-fab-button>
				<ion-icon color="light" :name="( (isPlaying) ? 'pause' : 'play')"></ion-icon>
			</ion-fab-button>
		</ion-fab>

		<ion-toolbar>
			<div slot="start" class="playback__timing">
				<span class="playback__timing--current">{{ elapsedSeconds | toSeconds }}</span>
				<span class="playback__timing--separator">/</span>
				<span class="playback__timing--total">{{ currentTrackDuration | toSeconds }}</span>
			</div>
			
			<div slot="start" class="playback__control" v-if="currentTrack">
				<ion-buttons class="playback__control__buttons">
					<ion-button icon-only end @click="navigateToNextTrack('next-icon')">
						<ion-icon name="skip-forward"></ion-icon>
					</ion-button>
					<ion-button icon-only end @click="toggleFave(currentTrack)">
						<ion-icon name="heart" color="dark"></ion-icon>
					</ion-button>
				</ion-buttons>
			</div>
			
			<div slot="start" class="playback__display" v-if="currentTrack">
				<div class="playback__display--creator">{{ currentTrack.creator }}</div>
				<div class="playback__display--title">{{ currentTrack.title }}</div>
			</div>
		</ion-toolbar>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import { Track } from '@/pages/track.interface';
import { Howl } from 'howler';
import PlayerControlSeeker from './PlayerControlSeeker.vue';

const BASE = 'https://tracks.gamemusicplayer.io';
const Player = namespace('player');
const Settings = namespace('settings');

@Component({
	components: { PlayerControlSeeker },
})
export default class PlayerControl extends Vue {
	private howler;
	private intervals = [];

	elapsedSeconds = 0;
	@Player.Getter allTracks: Track[];
	@Player.Getter currentTrack: Track;
	@Player.Getter currentTrackDuration: number;
	@Player.Getter trackFilter: string;
	@Player.Getter isPlaying: boolean;
	@Settings.Getter volume: number;
	@Settings.Getter isRepeat: boolean;
	@Settings.Getter isShuffle: boolean;
	
	// @Player.Action playNextTrack;
	@Player.Action setPlaying;
	@Player.Action setCurrentTrackDuration;
	@Player.Action playTrack;

	toggleFave() {
		console.log('@todo');
	}
	
	/**
	 * start playing the first track when tracks have been loaded.
	 */
	@Watch('allTracks')
	handleTracksLoaded() {
		const trackName = this.$router.currentRoute.params.trackName;
		if (trackName) {
			this.playTrack(`${trackName}.m4a`);
		} else {
			this.navigateToNextTrack();
		}
	}

	@Watch('$route')
	handleRouteChange(to, from) {
		console.log('route change', to, from);
		
		if (to.params.trackName !== (from.params || {}).trackName) {
			// @todo load track with params.trackName
			console.log('play track');
			this.playTrack(`${to.params.trackName}.m4a`);
		}
	}

	/**
	 * sets up the elapsing timer of holwer and its currently played track.
	 */
	created() {
		const interval = setInterval(() => {
			if (this.howler) {
				const elapsedSeconds = this.howler.seek();
				this.elapsedSeconds = (typeof elapsedSeconds === 'number')
					? elapsedSeconds
					: 0;
			}
		}, 100);
		this.intervals.push(interval);
	}

	destroyed() {
		this.intervals.forEach(w => clearInterval(w));
	}

	/**
	 * effects of selecting, pausing and resuming a track.
	 */
	@Watch('currentTrack')
	@Watch('isPlaying')
	handlePlaying() {
		if (this.currentTrack) {
			if (this.isPlaying) {
				// start current track
				this.playCurrentTrack();
			} else {
				// stop current track
				this.pause();
			}
		}
	}

	@Watch('volume')
	handleVolume() {
		if (this.howler) {
			this.howler.volume(this.volume / 100);
		}
	}

	/**
	 * whenever the user sought (ha! thought I didn't know the past tense of seek didcha!) on the player.
	 */
	seeked(position: number) {
		if (this.howler) {
			this.howler.seek(position);
		}
		console.log('@todo tracking seeked');
	}

	navigateToNextTrack(actionSource = 'none') {
		console.log('@todo tracking navigate to next track');
		let selectedTrack: Track = null;
		if (this.isShuffle) {
			// is shuffled
			const randomTrackIndex = Math.floor(Math.random() * (this.allTracks.length - 0));
			selectedTrack = this.allTracks[randomTrackIndex];
		} else {
			// is not shuffled
			const trackIndex = this.allTracks.indexOf(this.currentTrack);
			selectedTrack = (trackIndex + 1 >= this.allTracks.length) ?
				this.allTracks[0] :
				this.allTracks[trackIndex + 1];
		}
		const trackName = selectedTrack.trackName.split('.m4a').join('');
		this.$router.push({ name: 'player', params: { trackName }});
	}

	private playCurrentTrack() {
		// debugger;
		if (this.howler && this.howler._src === this.getTrackUrl() && this.isPlaying) {
			// resume
			this.howler.play();
		} else {
			if (this.howler) {
				// unload the old playing track for the new one
				this.howler.stop();
				this.howler.unload();
			}
			this.howler = new Howl({
				src: this.getTrackUrl(),
				autoplay: true,
				volume: this.volume / 100,
				html5: true,
				onload: () => this.onTrackLoaded(),
				onend: () => this.onTrackEnded(),
				// onseek: () => this.onSeeked(),
			});
		}
	}
	private resume() {
		if (this.howler) {
			this.howler.play();
		}
	}
	private pause() {
		if (this.howler) {
			this.howler.pause();
		}
	}
	private onTrackLoaded() {
		this.setCurrentTrackDuration(this.howler.duration());
	}
	private onTrackEnded() {
		console.log('track ended');
		if (this.isRepeat) {
			this.howler.play();
		} else {
			this.navigateToNextTrack();
		}
		// @tracking
		// this.trackCompleted(100);
	}
	private getTrackUrl() {
		return `${BASE}/${this.currentTrack.trackName}`;
	}
}
</script>

<style lang="scss" scoped>
$opacity-loading: 0.3;
$width-control: 100px;
$width-timing: 105px;

.playback {
	position: relative;
	background-color: #f8f8f8;
	transition: transform 0.3s ease-in-out;
	transform: translateY(50px);
	padding-top: 5px;

	.toolbar-content {
		display: flex;
	}

	&--shown {
		transform: translateY(0);
	}

	&--fab {
		margin-left: 25px;
		transform: translateY(-32px);
		color: white;
	}

	&__control {
		display: inline-block;
		margin-top: 0;
		margin-bottom: 0;
		position: absolute;
		// top: 12px;
		left: $width-timing + 15px;

		&__buttons {
			.playback--loading & {
				opacity: $opacity-loading;

				button:first-child {
					opacity: 0;
				}
			}
		}
	}

	&__display {
		position: absolute;
		left: $width-control + $width-timing + 5px;
		top: 7px;
		opacity: 1;
		transition: opacity 0.1s ease-in-out;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;

		&:hover {
			cursor: pointer;
		}

		// strong {
		// 	font-size: 16px;
		// }

		&--creator {
			// font-weight: 100;
			// font-size: 18px;
			// color: #555;
			// text-transform: uppercase;
			font-weight: bold;
			font-size: 18px;
		}

		&--title {
			margin-top: 3px;
			font-size: 14px;
		}

		.playback--loading & {
			opacity: $opacity-loading;
		}
	}

	&__timing {
		width: $width-timing; // so it can be centered in the middle of the fab heart
		position: absolute;
		top: 32px;
		left: 0;
		text-align: center;

		&--current {
			font-weight: bold;
		}

		&--separator {
			opacity: 0.5;
		}

		&--total {
			opacity: 0.5;
		}
	}

	&__seeker {
		width: calc(100% - 81px);
		z-index: 11;
		top: -6px;
		right: 0;
		position: absolute;
	}
}
</style>
