import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from "rxjs";
import { AppState } from "../../../app/app.state";
import { PlayerActions } from "../../../common/player/player.actions";
import { isShuffle, isRepeat } from "../../../common/player/player.selectors";
import { GoogleAnalyticsTracker } from "../../../common/tracking/google-analytics-tracker.provider";
import { PopoverController } from "ionic-angular";
import { VolumeSlider } from "../../../common/player/volume-slider/volume-slider.component";


@Component({
	selector: 'navbar-music-control',
	template: `
		<ion-buttons start end class="navbar-music-control">
			<button ion-button icon-only start (click)="openVolumeSlider($event)" class="navbar-music-control--active">
				<ion-icon [name]="(volume$ | async) == 0 ? 'volume-off' : 'volume-up'"></ion-icon>
			</button>
			<button ion-button icon-only (click)="toggleSetting('isRepeat')" [ngClass]="{'navbar-music-control--active': (isRepeat$ | async)}">
				<ion-icon name="repeat"></ion-icon>
			</button>
			<button ion-button icon-only (click)="toggleSetting('isShuffle')" [ngClass]="{'navbar-music-control--active': (isShuffle$ | async)}">
				<ion-icon name="shuffle"></ion-icon>
			</button>
			<a (click)="track" href="https://github.com/zwacky/game-music-player" target="_blank" ion-button icon-only class="navbar-music-control--active" title="Go to GitHub project">
				<ion-icon name="logo-github"></ion-icon>
			</a>
		</ion-buttons>
	`
})
export class NavbarMusicControl {

	isShuffle$: Observable<boolean>;
	isRepeat$: Observable<boolean>;

	constructor(
		private store: Store<AppState>,
		private playerActions: PlayerActions,
		private googleAnalyticsTracker: GoogleAnalyticsTracker,
		private popoverCtrl: PopoverController,
	) {
		this.isShuffle$ = this.store.select(isShuffle);
		this.isRepeat$ = this.store.select(isRepeat);
	}

	toggleSetting(settingKey: string) {
		this.store.dispatch(this.playerActions.toggleSetting(settingKey));
	}

	openVolumeSlider(evt: Event) {
		let popover = this.popoverCtrl.create(VolumeSlider);
		popover.present({
			ev: evt
		});
	}

	trackClickout() {
		this.googleAnalyticsTracker.trackEvent('page',  {
			action: 'project_clicked'
		});
	}

}
