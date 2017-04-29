import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from "rxjs";
import { AppState } from "../../../app/app.state";
import { PlayerActions } from "../../../common/player/player.actions";
import { isMuted, isShuffle, isRepeat } from "../../../common/player/player.selectors";


@Component({
	selector: 'navbar-music-control',
	template: `
		<ion-buttons start end class="navbar-music-control">
			<a href="https://github.com/zwacky/game-music-player" target="_blank" ion-button icon-only class="navbar-music-control--active" title="Go to GitHub project">
				<ion-icon name="logo-github"></ion-icon>
			</a>
			<button ion-button icon-only (click)="toggleSetting('isRepeat')" [ngClass]="{'navbar-music-control--active': (isRepeat$ | async)}">
				<ion-icon name="repeat"></ion-icon>
			</button>
			<button ion-button icon-only (click)="toggleSetting('isShuffle')" [ngClass]="{'navbar-music-control--active': (isShuffle$ | async)}">
				<ion-icon name="shuffle"></ion-icon>
			</button>
			<button ion-button icon-only (click)="toggleSetting('isMuted')" [ngClass]="{'navbar-music-control--active': !(isMuted$ | async)}">
				<ion-icon [name]="(musicControl$ | async)?.isMuted ? 'volume-off' : 'volume-up'"></ion-icon>
			</button>
		</ion-buttons>
	`
})
export class NavbarMusicControl {

	isMuted$: Observable<boolean>;
	isShuffle$: Observable<boolean>;
	isRepeat$: Observable<boolean>;

	constructor(
		private store: Store<AppState>,
		private playerActions: PlayerActions
	) {
		this.isMuted$ = this.store.select(isMuted);
		this.isShuffle$ = this.store.select(isShuffle);
		this.isRepeat$ = this.store.select(isRepeat);
	}

	toggleSetting(settingKey: string) {
		this.store.dispatch(this.playerActions.toggleSetting(settingKey));
	}

}
