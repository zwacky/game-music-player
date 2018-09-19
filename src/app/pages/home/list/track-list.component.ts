import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Track } from '../../../core/interfaces/track';
import { PlayerStore } from '../../../core/stores/player.store';
import { BufferedTrack } from './buffered-track';
import { UserDataStore } from '../../../core/stores/user-data.store';
import { map } from 'rxjs/operators';

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
			<track-list-item 
				*ngFor="let bufferedTrack of (bufferedTracks$ | async); trackBy: trackedBy"
				[bufferedTrack]="bufferedTrack">
				asdf
			</track-list-item>
			<!--
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
			-->
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
	private limitTo = 50; // already start off with 50
	private steps = 50;
	private baseBufferedTracks$: Observable<BufferedTrack[]>;
	private infiniteSteps$: BehaviorSubject<number> = new BehaviorSubject(this.steps);

	// bufferedTracks$: BehaviorSubject<BufferedTrack[]> = new BehaviorSubject([]);
	bufferedTracks$: Observable<BufferedTrack[]>;

	constructor(public playerStore: PlayerStore) {
		// bring tracks into the right format with isFaved, isPlaying, etc from BufferedTracks
		this.baseBufferedTracks$ = playerStore.filteredTracks$.pipe(
			map(filteredTracks =>
				filteredTracks.map(filteredTrack => ({
					...filteredTrack,
					isFaved: false,
					isCurrentTrack: false,
					isPlaying: true,
				}))
			)
		);

		this.bufferedTracks$ = combineLatest(
			this.baseBufferedTracks$,
			playerStore.isPlaying$,
			playerStore.currentTrack$,
			this.infiniteSteps$
		).pipe(
			map(([baseBufferedTracks, isPlaying, currentTrack, steps]) => {
				return baseBufferedTracks
					.map(track => {
						const checks = [
							currentTrack.id === track.id,
							currentTrack.id !== track.id && track.isCurrentTrack,
						];
						// return new reference in case one of the checks are true
						if (checks.some(Boolean)) {
							track = {
								...track,
								isCurrentTrack: currentTrack.id === track.id,
								isPlaying: currentTrack.id === track.id && isPlaying,
							};
						}
						return track;
					})
					.slice(0, steps);
			})
		);
	}

	increaseLimit(evt?, tracks = this.playerStore.state.tracks || []) {
		this.limitTo += this.steps;
		// this.updateTracks();
		console.log('TODO');

		// push event
		this.infiniteSteps$.next(this.limitTo);

		if (evt) {
			evt.target.complete();
		}
	}

	trackedBy(index: number, item: BufferedTrack) {
		return item.id;
	}
}
