import { Store } from "../store";
import { Injectable } from "@angular/core";
import { StorageManager } from "../common/storage-manager.provider";
import { Observable } from "rxjs";
import { map, distinctUntilChanged } from "../../../node_modules/rxjs/operators";

class UserDataStore {
	faveIds: string[];
	// seen news, clicked news, ...
}

enum UserDataFields {
	FAVES = 'faves',
}

@Injectable()
export class PlayerStore extends Store<UserDataStore> {

	faveIds$: Observable<string[]> = this.state$.pipe(
		map(s => s.faveIds),
		distinctUntilChanged(),
	);

	constructor(storageManager: StorageManager) {
		super(new UserDataStore());

		// load data from localStorage
		storageManager.getItem(UserDataFields.FAVES, [])
			.then(favesRaw => {
				const faveIds = JSON.parse(favesRaw);
				this.setState({ ...this.state, faveIds });
			});
	}
}