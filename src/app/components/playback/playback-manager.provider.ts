import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { interval, combineLatest, pipe } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { isNumber } from 'util';
import { Track } from '../../core/interfaces/track';
import { PlayerStore } from '../../core/stores/player.store';
import { SettingsStore } from '../../core/stores/settings.store';

@Injectable()
export class PlaybackManager {
	private audio;
	private base = 'https://tracks.gamemusicplayer.io';

	constructor(private playerStore: PlayerStore, private settingsStore: SettingsStore) {
		// auto play as soon as tracks are there
		playerStore.tracks$.pipe(first()).subscribe(tracks => {
			playerStore.playNextTrack();
		});

		// handle playing of new tracks
		playerStore.currentTrack$.subscribe(currentTrack => {
			if (this.audio) {
				this.audio.stop();
				this.audio.unload();
			}

			this.audio = new Howl({
				src: `${this.base}/${currentTrack.trackName}`,
				autoplay: true,
				volume: settingsStore.state.volume / 100,
				html5: true,
				onload: () => this.onTrackLoaded(),
				onend: () => this.onTrackEnded(),
				onseek: () => this.onSeeked(),
			});
		});

		// manage pause/resume of track
		playerStore.isPlaying$.subscribe(isPlaying => {
			if (this.audio) {
				if (isPlaying) {
					this.audio.play();
				} else {
					this.audio.pause();
				}
			}
		});

		// update the current seeker value
		combineLatest(
			interval(100),
			playerStore.isPlaying$,
			playerStore.currentTrackDuration$,
			(delay, isPlaying, currentTrackDuration) => isPlaying && !!currentTrackDuration
		)
			.pipe(filter(isPlaying => isPlaying))
			.subscribe(() => {
				const seconds = this.audio && isNumber(this.audio.seek()) ? this.audio.seek() : 0;
				playerStore.setElapsedSeconds(seconds);
			});

		settingsStore.volume$.subscribe(volume => {
			if (this.audio) {
				this.audio.volume(volume / 100);
			}
		});

		playerStore.currentTrackWantedSeeker$.subscribe(wantedSeeker => {
			if (this.audio) {
				console.log('seeking', wantedSeeker);
				this.audio.seek(wantedSeeker);
			}
		});
	}

	private onTrackLoaded() {
		this.playerStore.setDuration(this.audio.duration());

		// @tracking
		// this.googleAnalyticsTracker.trackEvent('track', {
		// 	action: 'started',
		// 	label: this.currentTrack.trackName
		// });
	}

	/**
	 * whenever the user sought (ha! thought I didn't know the past tense of seek didcha!) on the player.
	 */
	private onSeeked() {
		// @tracking
		// used seeker to x %
	}

	private onTrackEnded() {
		console.log('track ended');
		if (this.settingsStore.state.isRepeat) {
			this.audio.play();
		} else {
			this.playerStore.playNextTrack();
		}
		// @tracking
		// this.trackCompleted(100);
	}
}
