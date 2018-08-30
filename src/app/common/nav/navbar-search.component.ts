import { Component, ViewChild } from '@angular/core';
import { PlayerStore } from '../../stores/player.store';
import { GoogleAnalyticsTracker } from '../google-analytics-tracker.provider';

@Component({
	selector: 'navbar-search',
	template: `
		<ion-item style="display: inline-block;"> 
			<ion-input
				#navbarsearch
				type="text"
				placeholder="Search track or game…"
				(keyup)="changedInput($event)"
				(blur)="blurred($event)">
			</ion-input>
		</ion-item>
	`,
	styleUrls: ['./navbar-search.scss']
})
export class NavbarSearch {

	@ViewChild('navbarsearch') navbarSearch;

	constructor(
		private googleAnalyticsTracker: GoogleAnalyticsTracker,
		public playerStore: PlayerStore
	) {
		// bind cmd + f / ctrl + f to automatically focus on the search input
		window.addEventListener('keydown', (evt) => {
			if ((evt.ctrlKey || evt.metaKey) && evt.keyCode === 70) {
				evt.preventDefault();
				this.navbarSearch.setFocus();
			}
		});
	}

	/**
	 * every keystroke updates the filter.
	 *
	 * @param evt {Event}
	 */
	changedInput(evt) {
		if (evt.keyCode === 27) { // escape key
			evt.target.blur();
		} else {
			const value = evt.target.value;
			// this.playerStore.setTrackFilter(value);
		}
	}

	/**
	 * blur event is treated as a successful search.
	 * searches that are done, but result in a bounce are therefore not tracked.
	 */
	blurred(evt) {
		const value = evt.target.value;
		if (value) {
			this.googleAnalyticsTracker.trackEvent('player', {
				action: 'searched',
				label: value
			});
		}
	}
}
