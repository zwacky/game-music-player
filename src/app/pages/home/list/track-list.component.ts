import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../../../core/interfaces/track';
import { PlayerStore } from '../../../core/stores/player.store';

@Component({
	selector: 'track-list',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ion-list>
		<!-- <ion-virtual-scroll [items]="(playerStore.filteredTracks$ | async)"> -->
			<!--
			<ion-item 
				style="padding-bottom: 0;"
				*ngFor="let track of (bufferedTracks$ | async)" 
				(click)="playerStore.selectTrack(track)">
				<strong>{{track.creator}}</strong> — {{track.title}} <span *ngIf="(playerStore.currentTrack$ | async)?.id === track.id">*</span>
			</ion-item>
			-->

				<ion-item
					*ngFor="let track of (bufferedTracks$ | async); trackBy: trackedBy"
					class="track-list-item"
					[ngClass]="{'track-list-item--selected': track.isFaved}"
					(click)="playerStore.selectTrack(track)">
					
					<div class="track-list-item__container">
						<div class="track-list-item__container__symbol">
							<ion-icon name="musical-notes"></ion-icon>
						</div>
						<div class="track-list-item__container__bold">
							{{ track.creator }}
						</div>
						<div class="track-list-item__container__casual">
							{{ track.title }}
						</div>
						<!-- <track-list-item-more></track-list-item-more> -->
					</div>

					<!-- <strong>{{ track.creator }}</strong> {{ track.title}} -->
				</ion-item>
		<!-- </ion-virtual-scroll> -->
			
		</ion-list>

		<ion-infinite-scroll threshold="100px" (ionInfinite)="increaseLimit($event)">
			<ion-infinite-scroll-content></ion-infinite-scroll-content>
		</ion-infinite-scroll>
	`,
})
export class TrackList {
	private limitTo = 0;
	private steps = 50;
	private subscriptions = [];
	
	bufferedTracks$: BehaviorSubject<Track[]> = new BehaviorSubject([]);

	constructor(
		public playerStore: PlayerStore,
	) {
		const sub = playerStore.filteredTracks$.subscribe((tracks) => {
			this.limitTo = 0;
			this.increaseLimit(undefined, tracks);
		});
		this.subscriptions.push(sub);
	}

	increaseLimit(evt?, tracks = this.playerStore.state.tracks || []) {
		this.limitTo += this.steps;
		const filteredTracks = tracks.slice(0, this.limitTo);
		this.bufferedTracks$.next(filteredTracks);
		
		if (evt) {
			evt.target.complete();
		}
	}

	trackedBy(index: number, item: Track) {
		return index;
	}

	private ngOnDestroy() {
		this.subscriptions.forEach(sub => sub());
	}
}
