import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from "rxjs";
import { PlayerState } from "../../../common/player/player.reducer";
import { AppState } from "../../../app/app.state";
import { PlayerActions } from "../../../common/player/player.actions";


@Component({
	selector: 'navbar-music-control',
	template: `
		<ion-buttons start end class="navbar-music-control">
			<button ion-button icon-only (click)="toggleSetting('isRepeat')" [ngClass]="{'navbar-music-control--active': (musicControl$ | async)?.isRepeat}">
				<ion-icon name="repeat"></ion-icon>
			</button>
			<button ion-button icon-only (click)="toggleSetting('isShuffle')" [ngClass]="{'navbar-music-control--active': (musicControl$ | async)?.isShuffle}">
				<ion-icon name="shuffle"></ion-icon>
			</button>
			<button ion-button icon-only (click)="toggleSetting('isMuted')" [ngClass]="{'navbar-music-control--active': !(musicControl$ | async)?.isMuted}">
				<ion-icon [name]="(musicControl$ | async)?.isMuted ? 'volume-off' : 'volume-up'"></ion-icon>
			</button>
		</ion-buttons>
	`
})
export class NavbarMusicControl {

	public musicControl$: Observable<PlayerState>;
	public isMuted$: Observable<boolean>;

	constructor(
		private store: Store<AppState>,
		private playerActions: PlayerActions
	) {
		this.musicControl$ = this.store.select(state => state.player);
	}

	toggleSetting(settingKey: string) {
		this.store.dispatch(this.playerActions.toggleSetting(settingKey));
	}

}
