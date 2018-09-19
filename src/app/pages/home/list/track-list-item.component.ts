import { Component, Input, OnInit, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { PlayerStore } from '../../../core/stores/player.store';
import { BufferedTrack } from './buffered-track';

@Component({
	selector: 'track-list-item',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ion-item
			class="track-list__item"
			[ngClass]="{
				'track-list__item--active': bufferedTrack.isCurrentTrack,
				'track-list__item--faved': bufferedTrack.isFaved
			}"
			(click)="playerStore.selectTrack(bufferedTrack)">

			<div slot="start">
				<ion-icon 
					[name]="bufferedTrack.isPlaying ? 'play' : 'pause'" 
					class="track-list__item__is-playing"
					[style.opacity]="bufferedTrack.isCurrentTrack ? '1' : '0'">
				</ion-icon>
			</div>
			<div slot="start" class="track-list__item__creator">
				<strong>{{ bufferedTrack.creator }}</strong>
			</div>
			<div slot="start" class="track-list__item__title">
				{{ bufferedTrack.title }}
			</div>
			<div slot="end">
				<ion-icon 
					name="star" 
					class="track-list__item__is-faved"
					[style.opacity]="bufferedTrack.isFaved ? '1' : '0'">
				</ion-icon>
			</div>
		</ion-item>
	`,
})
export class TrackListItem implements OnChanges {
	@Input()
	bufferedTrack: BufferedTrack;

	constructor(public playerStore: PlayerStore) {}

	ngOnChanges(): void {
        // console.log('on changes!', this.bufferedTrack);
    }
}
