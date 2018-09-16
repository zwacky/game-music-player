import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../../../core/interfaces/track';
import { PlayerStore } from '../../../core/stores/player.store';

@Component({
	selector: 'track-list',
	styleUrls: ['./track-list.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<!-- 
		<ion-list>
			<ion-item 
				style="padding-bottom: 0;"
				*ngFor="let track of (bufferedTracks$ | async)" 
				(click)="playerStore.selectTrack(track)">
				<strong>{{track.creator}}</strong> — {{track.title}} <span *ngIf="(playerStore.currentTrack$ | async)?.id === track.id">*</span>
			</ion-item>
		</ion-list>
		-->

		<!--
		<ion-list>
			<ion-item
				*ngFor="let track of (bufferedTracks$ | async); trackBy: trackedBy"
				class="track-list-item"
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
				</div>
			</ion-item>
		</ion-list>
		-->

		<ion-list class="track-list">
			<ion-item
				*ngFor="let track of (bufferedTracks$ | async); trackBy: trackedBy"
				class="track-list__item"
				[ngClass]="{
					'track-list__item--active': (playerStore.currentTrack$ | async) === track,
					'track-list__item--faved': false
				}"
				(click)="playerStore.selectTrack(track)">

				<div slot="start">
					<ion-icon name="musical-notes" class="track-list__item__is-playing"></ion-icon>
				</div>
				<div slot="start" class="track-list__item__creator">
					<strong>{{ track.creator }}</strong>
				</div>
				<div slot="start" class="track-list__item__title">
					{{ track.title }}
				</div>
				<div slot="end">
					<ion-icon name="star" class="track-list__item__is-faved"></ion-icon>
				</div>
			</ion-item>
		</ion-list>

		<!--
		<ion-grid>
			<ion-row
				*ngFor="let track of (bufferedTracks$ | async); trackBy: trackedBy"
				class="track-list-item"
				(click)="playerStore.selectTrack(track)">

				<ion-col size="2">
					<ion-icon [hidden]="track.isFaved" name="musical-notes"></ion-icon>
					<ion-icon name="star"></ion-icon>
				</ion-col>
				<ion-col size="4" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
					<strong>{{ track.creator }}</strong>
				</ion-col>
				<ion-col size="6" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
					{{ track.title }}
				</ion-col>
			</ion-row>
		</ion-grid>
		-->

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
