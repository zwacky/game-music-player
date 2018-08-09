import { Injectable } from "@angular/core";
import { Store } from "../store";

class SettingsState {
	volume: number = 50;
	isShuffle: boolean = false;
	isRepeat: boolean = false;
	isMuted: boolean = false;
}

@Injectable()
export class PlayerStore extends Store<SettingsState> {

	constructor() {
		super(new SettingsState());
	}
}