import { Component, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { PlayerStore } from '../../../core/stores/player.store';
import { Track } from '../../../core/interfaces/track';

export interface TrackListItem extends Track {
	isFaved: boolean;
	isPlaying: boolean;
	isCurrentTrack: boolean;
}

@Component({
	selector: 'track-list-item',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ion-item
			class="track-list__item"
			[ngClass]="{
				'track-list__item--active': track.isCurrentTrack,
				'track-list__item--faved': track.isFaved
			}"
			(click)="playerStore.selectTrack(track)">

			<div slot="start">
				<ion-icon 
					[name]="track.isPlaying ? 'musical-notes' : 'pause'" 
					class="track-list__item__is-playing"
					[style.opacity]="track.isCurrentTrack ? '1' : '0'">
				</ion-icon>
			</div>
			<div slot="start" class="track-list__item__creator">
				<strong>{{ track.creator }}</strong>
			</div>
			<div slot="start" class="track-list__item__title">
				{{ track.title }}
			</div>
			<div slot="end">
				<ion-icon 
					name="star" 
					class="track-list__item__is-faved"
					[style.opacity]="track.isFaved ? '1' : '0'">
				</ion-icon>
			</div>
		</ion-item>
	`,
})
export class TrackListItemComponent implements OnChanges {
	@Input()
	track: TrackListItem;

	constructor(public playerStore: PlayerStore) {}

	ngOnChanges(): void {
        // console.log('on changes!', this.bufferedTrack);
    }
}
