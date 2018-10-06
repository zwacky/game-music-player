<template>
<input
	type="range"
	class="playback__seeker"
	v-model="trackSeeker"
	step="0.1"
	:max="trackDuration"
	@change="onRangeChanged($event)"
	@input="onRangeStarted()">	
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch, Prop } from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';

const Player = namespace('player');

@Component
export default class PlayerControlSeeker extends Vue {
	// needs to be decoupled from elapsedSeconds
	trackSeeker = 0;
	private isSeeking = false;

	@Prop(Number) elapsedSeconds;
	@Prop(Number) trackDuration;

	@Watch('elapsedSeconds')
	handleElapsedSeconds() {
		if (!this.isSeeking) {
			this.trackSeeker = this.elapsedSeconds;
		}
	}

	onRangeChanged(evt) {
		this.$emit('seeked', this.trackSeeker);
		this.isSeeking = false;
	}

	onRangeStarted() {
		this.isSeeking = true;
	}
}
</script>
