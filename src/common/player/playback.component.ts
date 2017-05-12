import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "../../app/app.state";
import { Observable, Observer } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { ToastController, PopoverController } from "ionic-angular";
import * as firebase from 'firebase';
import { Howl } from 'howler';
import { TrackScroller } from "./track-scroller.provider";
import { AudioState } from "./player.reducer";
import { Track } from "./track.interface";
import { PlayerActions } from "./player.actions";
import { getVolume, isMuted, getCurrentTrack, isPlaying, isShuffle, isRepeat, getAudioState } from "./player.selectors";
import { GoogleAnalyticsTracker } from "../tracking/google-analytics-tracker.provider";
import { VolumeSlider } from "./volume-slider/volume-slider.component";


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
							<button ion-button icon-only start (click)="openVolumeSlider($event)">
								<ion-icon [name]="(volume$ | async) == 0 ? 'volume-off' : 'volume-up'"></ion-icon>
							</button>
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
	private tempPlayerState: {isShuffle: boolean, isRepeat: boolean} = {
		isShuffle: null,
		isRepeat: null,
	};
	private isRangeSliderMoving = false;
	private seekerObserver: Observer<number>;


	constructor(
		private store: Store<AppState>,
		private playerActions: PlayerActions,
		private toastCtrl: ToastController,
		private googleAnalyticsTracker: GoogleAnalyticsTracker,
		private popoverCtrl: PopoverController,
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

		// bind space to toggling play/pause
		window.addEventListener('keypress', (evt) => {
			if (evt.charCode === 32) {
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
					firebase.storage()
						.ref(`/tracks/${track.trackName}`)
						.getDownloadURL()
						.then((url) => {
							if (this.audio) {
								this.audio.stop();
							}
							this.audio = new Howl({
								src: url,
								autoplay: true,
								volume: this.volumeLevel / 100,
								html5: true,
								onload: () => this.onTrackLoaded(),
								onend: () => this.onTrackEnded(),
								onseek: () => this.onSeeked(),
							});
							this.currentTrack = track;
						});
					this.store.dispatch(this.playerActions.setAudioState(AudioState.LOADING));

					if (this.seekerObserver) {
						this.seekerObserver.next(0);
					}
					this.trackDuration = 0;
				}
			});

		// handle pause tracking (only if a track has been loaded)
		this.isPlaying$
			.subscribe(isPlaying => {
				if (!isPlaying) {
					if (this.audio) {
						this.audio.pause();
					}
				} else {
					if (this.audio) {
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
		const toast = this.toastCtrl.create({
			message: 'Not implemented yet 😭',
			duration: 2000,
			position: 'bottom'
		});
		toast.present();

		this.trackFaveToggled(this.currentTrack.trackName);
	}

	nextTrack() {
		const percentageCompleted = this.audio.seek() / this.trackDuration * 100;
		this.trackCompleted(parseInt((percentageCompleted).toFixed(0)));
		this.trackNextClicked();

		this.store.dispatch(this.playerActions.nextTrack(this.currentTrack, this.tempPlayerState.isShuffle, false));
	}

	openVolumeSlider(evt) {
		let popover = this.popoverCtrl.create(VolumeSlider);
		popover.present({
			ev: evt
		});
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
		this.store.dispatch(this.playerActions.nextTrack(this.currentTrack, this.tempPlayerState.isShuffle, this.tempPlayerState.isRepeat));
		this.trackCompleted(100);

		// needs to unload otherwise onstop event will be triggered twice
		this.audio.unload();
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
