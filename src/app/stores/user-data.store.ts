import { Store } from "../store";
import { Injectable } from "@angular/core";
import { StorageManager } from "../common/storage-manager.provider";
import { Observable } from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";
import { Track } from "../common/track";

class UserDataState {
	faveIds: string[];
	// seen news, clicked news, ...
}

enum UserDataFields {
	FAVES = 'faves',
}

@Injectable()
export class UserDataStore extends Store<UserDataState> {

	faveIds$: Observable<string[]> = this.state$.pipe(
		map(s => s.faveIds),
		distinctUntilChanged(),
	);

	constructor(storageManager: StorageManager) {
		super(new UserDataState());

		// load data from localStorage
		storageManager.getItem(UserDataFields.FAVES, [])
			.then(favesRaw => {
				const faveIds = JSON.parse(favesRaw);
				this.setState({ ...this.state, faveIds });
			});
	}

	toggleFave(track: Track) {
		console.log('toggle', track);
	}
}