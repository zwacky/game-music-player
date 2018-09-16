import { Component } from '@angular/core';
import { SettingsStore } from '../../../core/stores/settings.store';

@Component({
	template: `
		<ion-item>
			<ion-range
				min="0"
				max="100"
				step="10"
				snaps="false"
				color="dark"
				[value]="sliderValue"
				(ionChange)="settingsStore.setVolume($event.target.value)">

				<ion-icon slot="start" name="volume-off" style="padding-right: 10px;"></ion-icon>
     			<ion-icon slot="end" name="volume-high" style="padding-left: 10px;"></ion-icon>
			</ion-range>
		</ion-item>
	`,
})
export class VolumeSlider {
	sliderValue: number;
	private subscriptions = [];

	constructor(public settingsStore: SettingsStore) {
		const sub = settingsStore.volume$.subscribe(volume => (this.sliderValue = volume));
		this.subscriptions.push(sub);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}
}
