import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';
import { ToastController } from 'ionic-angular';
import { Howl } from 'howler';
import { TrackScroller } from './track-scroller.provider';
import { AudioState } from './player.reducer';
import { Track } from './track.interface';
import { PlayerActions } from './player.actions';
import { getVolume, isMuted, getCurrentTrack, isPlaying, isShuffle, isRepeat, getAudioState } from './player.selectors';
import { GoogleAnalyticsTracker } from '../tracking/google-analytics-tracker.provider';
import '../rxjs.deps';


@Component({
	selector: 'playback',
	template: `
		<ion-footer>
			<div class="playback" [ngClass]="{'playback--shown': true}">

				<input
					type="range"
					class="playback__seeker"
					[value]="seekerValue"
					step="0.01"
					(change)="onRangeChanged($event)"
					(input)="onRangeStarted()">

				<ion-fab top left edge class="playback--fab" (click)="togglePlay()">
					<button ion-fab>
						<!-- <ion-icon [name]="(currentTrack$ | async)?.isFaved ? 'heart' : 'heart-outline'"></ion-icon> -->
						<ion-icon [name]="(isPlaying$ | async) ? 'pause' : 'play'"></ion-icon>
					</button>
				</ion-fab>

				<ion-toolbar>

					<div class="playback__timing">
						<span class="playback__timing--current">{{ (trackDurationPosition$ | async) | fromSeconds }}</span>
						<span class="playback__timing--separator">/</span>
						<span class="playback__timing--total">{{ trackDuration | fromSeconds }}</span>
					</div>

					<div class="playback__control">
						<ion-buttons class="playback__control__buttons">
							<button ion-button icon-only end (click)="nextTrack()">
								<ion-icon name="skip-forward"></ion-icon>
							</button>
							<button ion-button icon-only end (click)="toggleFave()">
								<ion-icon name="heart" color="dark"></ion-icon>
							</button>
							<!--
							<button ion-button icon-only start (click)="openVolumeSlider($event)">
								<ion-icon [name]="(volume$ | async) == 0 ? 'volume-off' : 'volume-up'"></ion-icon>
							</button>
							-->
						</ion-buttons>
					</div>

					<div class="playback__display" (click)="scrollToTrack()" *ngIf="(currentTrack$ | async)">
						<div class="playback__display--creator">{{ (currentTrack$ | async)?.creator }}</div>
						<div class="playback__display--title">{{ (currentTrack$ | async)?.title }}</div>
					</div>
				</ion-toolbar>
			</div>
		</ion-footer>
	`
})
export class Playback {

	currentTrack$: Observable<Track>;
	volume$: Observable<number>;
	isMuted$: Observable<boolean>;
	isPlaying$: Observable<boolean>;
	isShuffle$: Observable<boolean>;
	isRepeat$: Observable<boolean>;
	audioState$: Observable<AudioState>;
	trackDurationPosition$: Observable<number>;

	seekerValue: number = 0;
	seekerStyle: any = {};
	trackDuration: number = 0;

	private audio: any; // Howl instance
	private audioState: AudioState;
	private volumeLevel = 0;
	private currentTrack: Track = null;
	private pausedTrack: Track = null;
	private tempPlayerState: {isShuffle: boolean, isRepeat: boolean} = {
		isShuffle: null,
		isRepeat: null,
	};
	private isRangeSliderMoving = false;
	private seekerObserver: Observer<number>;


	constructor(
		private store: Store<AppState>,
		private playerActions: PlayerActions,
		private googleAnalyticsTracker: GoogleAnalyticsTracker,
	) {
		this.volume$ = this.store.select(getVolume);
		this.isMuted$ = this.store.select(isMuted);
		this.currentTrack$ = this.store.select(getCurrentTrack);
		this.isPlaying$ = this.store.select(isPlaying);
		this.isShuffle$ = this.store.select(isShuffle);
		this.isRepeat$ = this.store.select(isRepeat);
		this.audioState$ = this.store.select(getAudioState);


		Observable
			.interval(200)
			.subscribe(() => {
				if (this.audioState === AudioState.LOADED && !this.isRangeSliderMoving) {
					this.seekerValue = this.audio.seek() / this.trackDuration * 100;
				}
			});

		// bind space to toggling play/pause and omit if a input field is focused (search)
		window.addEventListener('keydown', (evt) => {
			if (evt.which === 32 && ['input'].indexOf(document.activeElement.tagName.toLowerCase()) === -1) {
				evt.preventDefault();
				this.togglePlay('space');
			}
		});


		// handle volume
		this.volume$
			.subscribe(volume => {
				this.volumeLevel = volume;
				this.setPlayerVolume(volume);
			});

		// handle muted
		this.isMuted$
			.subscribe(isMuted => this.setPlayerVolume((isMuted) ? 0 : this.volumeLevel));

		// handle track loading
		this.currentTrack$
			.filter(track => track !== null)
			.subscribe(track => {
				// check if the same track is already loaded. if yes, restart it.
				if (this.currentTrack === track) {
					if (this.audioState === AudioState.LOADED) {
						this.audio.seek(0);
					}
				} else {
					const base = 'https://tracks.gamemusicplayer.io';
					const url = `${base}/${track.trackName}`;

					if (this.audio) {
						this.audio.stop();
					}

					// have it wrapped around timeout for no ugly race conditions
					setTimeout(() => {
						this.audio = new Howl({
							src: url,
							autoplay: true,
							volume: this.volumeLevel / 100,
							html5: true,
							onload: () => this.onTrackLoaded(),
							onend: () => this.onTrackEnded(),
							onseek: () => this.onSeeked(),
						});
					});

					this.currentTrack = track;
					this.store.dispatch(this.playerActions.setAudioState(AudioState.LOADING));

					if (this.seekerObserver) {
						this.seekerObserver.next(0);
					}
					this.trackDuration = 0;
				}
			});

		// handle pause tracking
		// - only if a track has been loaded
		// - only unpause if it's the same track when it's been paused
		this.isPlaying$
			.subscribe(isPlaying => {
				if (!isPlaying) {
					if (this.audio) {
						this.audio.pause();
						this.pausedTrack = this.currentTrack;
					}
				} else {
					// only start playing the track if it's been the same that has been halted
					if (this.audio && this.pausedTrack === this.currentTrack) {
						this.audio.play();
					}
				}
			});

		// handle isShuffle property
		this.isShuffle$
			.subscribe(isShuffle => this.tempPlayerState.isShuffle = isShuffle);

		// handle isRepeat property
		this.isRepeat$
			.subscribe(isRepeat => this.tempPlayerState.isRepeat = isRepeat);

		// handle seeker value
		this.audioState$
			.subscribe(audioState => {
				this.audioState = audioState;
				if (audioState === AudioState.LOADING) {
					this.seekerValue = 0;
				}
			});

		/**
		 * update the current track duration position upon:
		 * - every 1 seconds
		 * - when the player is playing/pausing
		 */
		this.trackDurationPosition$ = Observable.merge(
			Observable
				.create(observer => this.seekerObserver = observer),
			Observable
				.interval(500)
				.map(() => (this.audioState === AudioState.LOADED) ? this.audio.seek() : 0),
		);
	}

	togglePlay(triggeredBy = 'click') {
		this.store.dispatch(this.playerActions.toggleSetting('isPlaying'));

		this.googleAnalyticsTracker.trackEvent('player', {
			action: 'toggle_play',
			label: triggeredBy
		});
	}

	toggleFave() {
		this.store.dispatch(this.playerActions.toggleFaveTrack(this.currentTrack));

		this.trackFaveToggled(this.currentTrack.trackName);
	}

	nextTrack() {
		const percentageCompleted = this.audio.seek() / this.trackDuration * 100;
		this.trackCompleted(parseInt((percentageCompleted).toFixed(0)));
		this.trackNextClicked();

		this.store.dispatch(this.playerActions.nextTrack(this.currentTrack, this.tempPlayerState.isShuffle));
	}

	scrollToTrack() {
		TrackScroller.scrollToSelectedTrack();
	}

	/**
	 * event upon changeing the range manually.
	 */
	onRangeChanged(evt) {
		if (this.audioState === AudioState.LOADED) {
			const seconds = this.trackDuration * (evt.target.value / 100);
			this.audio.seek(seconds);
			this.isRangeSliderMoving = false;
		}
	}

	onRangeStarted() {
		this.isRangeSliderMoving = true;
	}

	private onTrackLoaded() {
		this.store.dispatch(this.playerActions.setAudioState(AudioState.LOADED));
		this.trackDuration = this.audio.duration();

		this.googleAnalyticsTracker.trackEvent('track', {
			action: 'started',
			label: this.currentTrack.trackName
		});
	}

	private onTrackEnded() {
		if (this.tempPlayerState.isRepeat) {
			this.audio.play();
		} else {
			this.store.dispatch(this.playerActions.setAudioState(AudioState.UNLOADED));
			this.store.dispatch(this.playerActions.nextTrack(this.currentTrack, this.tempPlayerState.isShuffle));
			// needs to unload otherwise onstop event will be triggered twice
			this.audio.unload();
		}
		this.trackCompleted(100);
	}

	/**
	 * whenever the user sought (ha! thought I didn't know the past tense of seek didcha!) on the player.
	 */
	private onSeeked() {
		this.seekerObserver.next(this.audio.seek());
	}

	private setPlayerVolume(volume) {
		if (this.audio) {
			this.audio.volume(volume / 100);
		}
	}

	private trackCompleted(percentage: number) {
		this.googleAnalyticsTracker.trackEvent('track', {
			action: 'completed',
			label: percentage,
			nonInteraction: true,
		});
	}

	private trackNextClicked() {
		this.googleAnalyticsTracker.trackEvent('player', {
			action: 'next_clicked'
		});
	}

	private trackFaveToggled(trackName) {
		this.googleAnalyticsTracker.trackEvent('player', {
			action: 'fave_toggled',
			label: trackName
		});
	}

}
