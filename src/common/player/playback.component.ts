import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "../../app/app.state";
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { ToastController } from "ionic-angular";
import * as firebase from 'firebase';
import { Howl } from 'howler';
import { TrackScroller } from "./track-scroller.provider";
import { AudioState } from "./player.reducer";
import { Track } from "./track.interface";
import { PlayerActions } from "./player.actions";
import { getVolume, isMuted, getCurrentTrack, isPlaying, isShuffle, isRepeat, getAudioState } from "./player.selectors";
import { GoogleAnalyticsTracker } from "../tracking/google-analytics-tracker.provider";


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

				<ion-fab top right edge class="playback--fab" (click)="toggleFave()">
					<button ion-fab>
						<ion-icon [name]="(currentTrack$ | async)?.isFaved ? 'heart' : 'heart-outline'"></ion-icon>
					</button>
				</ion-fab>

				<ion-toolbar>
					<div class="playback__control">
						<ion-buttons class="playback__control__buttons">
							<button ion-button icon-only start (click)="togglePlay()">
								<ion-icon [name]="(isPlaying$ | async) ? 'pause' : 'play'"></ion-icon>
							</button>
							<button ion-button icon-only end (click)="nextTrack()">
								<ion-icon name="skip-forward"></ion-icon>
							</button>
						</ion-buttons>
					</div>

					<div class="playback__display" (click)="scrollToTrack()" *ngIf="(currentTrack$ | async)">
						<strong>{{ (currentTrack$ | async)?.creator }}</strong>
						&nbsp;&nbsp;{{ (currentTrack$ | async)?.title }}
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


	constructor(
		private store: Store<AppState>,
		private playerActions: PlayerActions,
		private toastCtrl: ToastController,
		private googleAnalyticsTracker: GoogleAnalyticsTracker
	) {
		this.volume$ = this.store.select(getVolume);
		this.isMuted$ = this.store.select(isMuted);
		this.currentTrack$ = this.store.select(getCurrentTrack);
		this.isPlaying$ = this.store.select(isPlaying);
		this.isShuffle$ = this.store.select(isShuffle);
		this.isRepeat$ = this.store.select(isRepeat);
		this.audioState$ = this.store.select(getAudioState);


		setInterval(() => {
			if (this.audioState === AudioState.LOADED && !this.isRangeSliderMoving) {
				this.seekerValue = this.audio.seek() / this.trackDuration * 100;
			}
		}, 200);

		// handle volume
		this.volume$
			.subscribe((volume) => {
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
							volume: this.volumeLevel,
							html5: true,
							onload: () => this.onTrackLoaded(),
							onend: () => this.onTrackEnded(),
						});
						this.currentTrack = track;
					});

				this.store.dispatch(this.playerActions.setAudioState(AudioState.LOADING));
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
	}

	togglePlay() {
		this.store.dispatch(this.playerActions.toggleSetting('isPlaying'));
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

	private setPlayerVolume(volume) {
		if (this.audio) {
			this.audio.volume(volume);
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
