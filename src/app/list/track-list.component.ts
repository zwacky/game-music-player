import { PlayerStore } from '../stores/player.store';
import { Track } from "../common/track";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'track-list',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ion-list>
		<!-- <ion-virtual-scroll [items]="(playerStore.filteredTracks$ | async)"> -->
			<ion-item 
				style="padding-bottom: 0;"
				*ngFor="let track of (bufferedTracks$ | async)" 
				(click)="playerStore.selectTrack(track)">
				<strong>{{track.creator}}</strong> — {{track.title}} <span *ngIf="(playerStore.currentTrack$ | async)?.id === track.id">*</span>
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

	private ngOnDestroy() {
		this.subscriptions.forEach(sub => sub());
	}
}
