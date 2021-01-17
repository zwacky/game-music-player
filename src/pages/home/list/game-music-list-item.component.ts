import { Component, Input } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "../../../app/app.state";
import { Track } from "../../../common/player/track.interface";
import { PlayerActions } from "../../../common/player/player.actions";
import { GoogleAnalyticsTracker } from "../../../common/tracking/google-analytics-tracker.provider";
import { HomeActions } from "../home.actions";

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
					{{ track.game }}
				</div>
				<div class="game-music-list-item__container__casual">
					{{ track.title }}
				</div>
				<game-music-list-item-more></game-music-list-item-more>
			</div>
			<!-- <strong>{{ track.game }}</strong> {{ track.title}} -->
		</button>
	`,
})
export class GameMusicListItem {

	@Input() track: Track;
	@Input() isSelected: boolean;
	@Input() idx: number;

	constructor(
		private store: Store<AppState>,
		private playerActions: PlayerActions,
		private googleAnalyticsTracker: GoogleAnalyticsTracker,
		private homeActions: HomeActions,
	) {

	}

	ngOnInit() {
		if (this.idx === 0) {
			this.store.dispatch(this.homeActions.setRendered(true));
		}
	}

	selectTrack(track: Track) {
		// check if the track will be restarted
		if (this.isSelected) {
			this.store.dispatch(this.playerActions.selectTrack(null));

			this.googleAnalyticsTracker.trackEvent('player', {
				action: 'track_selected_restart',
				label: track.file
			});
		}
		this.store.dispatch(this.playerActions.selectTrack(track));

		this.googleAnalyticsTracker.trackEvent('player', {
			action: 'track_selected',
			label: track.file
		});
	}
}
