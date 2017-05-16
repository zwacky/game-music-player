import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "../../app/app.state";
import { getFaveIds } from "../player/player.selectors";


export enum Field {
	FAVE_IDS,
}

@Injectable()
export class StorageManager {

	private FIELD_FAVE_IDS = 'faveIds';

	constructor(
		private store: Store<AppState>,
	) {
		this.store.select(getFaveIds)
			.subscribe(faveIds => {
				localStorage.setItem(this.FIELD_FAVE_IDS, JSON.stringify(faveIds));
			});
	}

	static getItem(field: Field) {
		switch (field) {
			case Field.FAVE_IDS:
				return JSON.parse(localStorage.getItem('faveIds'));
			default:
				return null;
		}
	}

	private getFieldString(field: Field) {
		switch (field) {
			case Field.FAVE_IDS:
				return 'faveIds';
			default:
				return null;
		}
	}

}
