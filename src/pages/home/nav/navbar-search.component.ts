import { PlayerActions } from './../../../common/player/player.actions';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { AppState } from '../../../app/app.state';

@Component({
	selector: 'navbar-search',
	template: `
	<ion-item>
		<ion-input type="text" placeholder="Search track or game…" (keyup)="changedInput($event)"></ion-input>
	</ion-item>
	`
})
export class NavbarSearch {

	constructor(
		private store: Store<AppState>,
		private playerActions: PlayerActions,
	) {

	}

	/**
	 * every keystroke updates the filter.
	 *
	 * @param evt {Event}
	 */
	changedInput(evt) {
		this.store.dispatch(this.playerActions.setSearchFiter(evt.target.value));
	}
}
