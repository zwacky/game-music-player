import { Component, Input } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "../../../app/app.state";
import { Track } from "../../../common/player/track.interface";
import { PlayerActions } from "../../../common/player/player.actions";
import { GoogleAnalyticsTracker } from "../../../common/tracking/google-analytics-tracker.provider";

@Component({
	selector: 'game-music-list-item',
	template: `
		<button
			ion-item
			class="game-music-list-item"
			[ngClass]="{'game-music-list-item--selected': isSelected}"
			(click)="selectTrack(track)">
			<div class="game-music-list-item__container">
				<div class="game-music-list-item__container__symbol">
					<ion-icon name="musical-notes"></ion-icon>
				</div>
				<div class="game-music-list-item__container__bold">
					{{ track.creator }}
				</div>
				<div class="game-music-list-item__container__casual">
					{{ track.title }}
				</div>
			</div>
			<!-- <strong>{{ track.creator }}</strong> {{ track.title}} -->
		</button>
	`,
})
export class GameMusicListItem {

	@Input() track: Track;
	@Input() isSelected: boolean;

	constructor(
		private store: Store<AppState>,
		private playerActions: PlayerActions,
		private googleAnalyticsTracker: GoogleAnalyticsTracker
	) {

	}

	selectTrack(track: Track) {
		// check if the track will be restarted
		if (this.isSelected) {
			this.store.dispatch(this.playerActions.selectTrack(null));

			this.googleAnalyticsTracker.trackEvent('player', {
				action: 'track_selected_restart',
				label: track.trackName
			});
		}
		this.store.dispatch(this.playerActions.selectTrack(track));

		this.googleAnalyticsTracker.trackEvent('player', {
			action: 'track_selected',
			label: track.trackName
		});
	}
}
