import { PlayerStore, Track } from '../stores/player.store';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'track-list',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ion-list>
			<ion-item *ngFor="let track of bufferedTracks;" (click)="playerStore.selectTrack(track)">
				{{track.title}} <span *ngIf="(playerStore.selectedTrack$ | async)?.id === track.id">*</span>
			</ion-item>
		</ion-list>
	`,
})
export class TrackList {
	private limitTo = 50;
	private steps = 50;

	allTracks: Track[];
	bufferedTracks: Track[] = [];

	constructor(public playerStore: PlayerStore, changeDetectorRef: ChangeDetectorRef) {
		playerStore.selectedTrack$.subscribe(selectedTrack =>
			console.log('selectedTrack:', selectedTrack)
		);

		playerStore.tracks$.subscribe(tracks => {
			this.allTracks = tracks;
			this.updateBufferedTracks();
			changeDetectorRef.detectChanges();
		});
	}

	private updateBufferedTracks() {
		this.bufferedTracks = this.allTracks.filter((item, index) => index < this.limitTo);
	}
}
