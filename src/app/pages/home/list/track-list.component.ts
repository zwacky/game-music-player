import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { PlayerStore } from '../../../core/stores/player.store';
import { map } from 'rxjs/operators';
import { TrackListItem } from './track-list-item.component';

@Component({
	selector: 'track-list',
	styleUrls: ['./track-list.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ion-list class="track-list">
			<track-list-item 
				*ngFor="let trackListItem of (trackListItems$ | async); trackBy: trackedBy"
				[track]="trackListItem">
			</track-list-item>
		</ion-list>

		<ion-infinite-scroll threshold="100px" (ionInfinite)="increaseLimit($event)">
			<ion-infinite-scroll-content></ion-infinite-scroll-content>
		</ion-infinite-scroll>
	`,
})
export class TrackList {
	private limitTo = 50; // already start off with 50
	private steps = 50;
	private infiniteSteps$: BehaviorSubject<number> = new BehaviorSubject(this.steps);

	trackListItems$: Observable<TrackListItem[]>;

	constructor(public playerStore: PlayerStore) {
		this.trackListItems$ = combineLatest(
			playerStore.trackListItems$,
			playerStore.isPlaying$,
			playerStore.currentTrack$,
			this.infiniteSteps$
		).pipe(
			map(([baseTrackListItems, isPlaying, currentTrack, steps]) => {
				return baseTrackListItems
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

	trackedBy(index: number, item: TrackListItem) {
		return item.id;
	}
}
