<template>
	<div class="track-list" v-toggleClass="{ 'playing': isPlaying, 'not-playing': !isPlaying }">
		<ion-item
			class="track-list__item"
			v-toggleClass="{ 'current-track': currentTrack && track.id === currentTrack.id }"
			v-for="track in filteredTracks"
			:key="track.id"
			@click="playTrack(track.trackName)">

			<div slot="start">
				<ion-icon class="track-list__item__play" name="musical-notes"></ion-icon>
				<ion-icon class="track-list__item__pause" name="pause"></ion-icon>
			</div>

			<div slot="start">
				<strong>{{ track.creator }}</strong> {{ track.title }}
			</div>

		</ion-item>

		<ion-infinite-scroll 
			threshold="200px" 
			@ionInfinite="showMoreTracks($event)">
			<ion-infinite-scroll-content></ion-infinite-scroll-content>
		</ion-infinite-scroll>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';

const Player = namespace('player')

@Component
export default class PlayerTrackList extends Vue {
	@Player.Getter filteredTracks;
	@Player.Getter isPlaying;
	@Player.Getter currentTrack;
	
	@Player.Action showMoreTracks;
	@Player.Action playTrack;
}
</script>

<style lang="scss" scoped>
	.track-list {
		&__item {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			cursor: pointer;
			transition: background-color 0.2s ease-in-out;

			&__play {
				position: absolute;
				visibility: hidden;
				
				.current-track & {
					.playing & {
						visibility: visible;
					}
				}
			}

			&__pause {
				visibility: hidden;

				.current-track & {
					.not-playing & {
						visibility: visible;
					}
				}
			}

			&.current-track {
				background-color: #ebebeb;
			}
		}
	}
</style>
