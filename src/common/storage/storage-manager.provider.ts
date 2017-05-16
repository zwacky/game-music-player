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

	static getItem(field: Field, defaultValue: any) {
		let value;
		switch (field) {
			case Field.FAVE_IDS:
				value = localStorage.getItem('faveIds');
				return (value !== null) ?
					JSON.parse(value) :
					defaultValue;
			default:
				return null;
		}
	}

}
