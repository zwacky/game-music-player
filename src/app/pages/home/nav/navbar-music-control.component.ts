import { Component } from '@angular/core';
import { VolumeSlider } from './volume-slider.component';
import { PopoverController } from '@ionic/angular';
import { GoogleAnalyticsTracker } from '../../../core/providers/google-analytics-tracker.provider';
import { PlaybackManager } from '../../../components/playback/playback-manager.provider';
import { SettingsStore } from '../../../core/stores/settings.store';
// import { GoogleAnalyticsTracker } from "../../../common/tracking/google-analytics-tracker.provider";

@Component({
	selector: 'navbar-music-control',
	template: `
		<ion-buttons slot="primary" class="navbar-music-control">
			<ion-button class="navbar-music-control--active" (click)="openVolumeSlider($event)">
				<ion-icon slot="icon-only" name="volume-high" *ngIf="(settingsStore.volume$ | async) != 0"></ion-icon>
				<ion-icon slot="icon-only" name="volume-off" *ngIf="(settingsStore.volume$ | async) == 0"></ion-icon>
			</ion-button>
			<ion-button (click)="settingsStore.toggleSetting('isRepeat')" [ngClass]="{'navbar-music-control--active': (settingsStore.isRepeat$ | async)}">
				<ion-icon slot="icon-only" name="repeat"></ion-icon>
			</ion-button>
			<ion-button (click)="settingsStore.toggleSetting('isShuffle')" [ngClass]="{'navbar-music-control--active': (settingsStore.isShuffle$ | async)}">
				<ion-icon slot="icon-only" name="shuffle"></ion-icon>
			</ion-button>
			<ion-button href="https://github.com/zwacky/game-music-player" (click)="trackClickout()" target="_blank" rel="noopener" class="navbar-music-control--active" title="Go to GitHub project">
				<ion-icon slot="icon-only" name="logo-github"></ion-icon>
			</ion-button>
		</ion-buttons>
	`,
	styleUrls: ['./navbar-music-control.scss'],
})
export class NavbarMusicControl {
	constructor(
		private googleAnalyticsTracker: GoogleAnalyticsTracker,
		private popoverCtrl: PopoverController,
		private playback: PlaybackManager,
		public settingsStore: SettingsStore
	) {}

	toggleSetting(settingKey: string) {
		// this.store.dispatch(this.playerActions.toggleSetting(settingKey));
	}

	async openVolumeSlider(evt: Event) {
		let popover = await this.popoverCtrl.create({
			component: VolumeSlider,
			ev: evt,
		});
		popover.present();
	}

	trackClickout() {
		// this.googleAnalyticsTracker.trackEvent('page',  {
		// 	action: 'project_clicked'
		// });
	}
}
