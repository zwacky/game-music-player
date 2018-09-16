import { Injectable } from '@angular/core';
import { Store } from '../store';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

class SettingsState {
	volume: number = 50;
	isShuffle: boolean = true;
	isRepeat: boolean = false;
	isMuted: boolean = false;
}
export type SettingsFields = typeof SettingsState;

@Injectable()
export class SettingsStore extends Store<SettingsState> {
	volume$: Observable<number> = this.state$.pipe(
		map(s => s.volume),
		distinctUntilChanged()
	);

	isShuffle$: Observable<boolean> = this.state$.pipe(
		map(s => s.isShuffle),
		distinctUntilChanged()
	);

	isRepeat$: Observable<boolean> = this.state$.pipe(
		map(s => s.isRepeat),
		distinctUntilChanged()
	);

	isMuted$: Observable<boolean> = this.state$.pipe(
		map(s => s.isMuted),
		distinctUntilChanged()
	);

	constructor() {
		super(new SettingsState());
	}

	toggleSetting(settingKey: string) {
		this.setState({ ...this.state, [settingKey]: !this.state[settingKey] });
	}

	setVolume(volume: number) {
		this.setState({ ...this.state, volume});
	}
}
