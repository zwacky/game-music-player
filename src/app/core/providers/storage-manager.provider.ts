import { Injectable } from '@angular/core';

@Injectable()
export class StorageManager {
	private isStorageAvailable: Promise<boolean>;
	private STORAGE_TEST_FIELD = '__storage_test__';

	constructor() {
		this.isStorageAvailable = new Promise((resolve, reject) => {
			try {
				localStorage.setItem(this.STORAGE_TEST_FIELD, this.STORAGE_TEST_FIELD);
				localStorage.removeItem(this.STORAGE_TEST_FIELD);
				resolve(true);
			} catch (e) {
				reject();
			}
		});
	}

	getItem(fieldName, defaultValue = null): Promise<string> {
		return new Promise(resolve => {
			this.isStorageAvailable
				.then(() => resolve(localStorage.getItem(fieldName)))
				.catch(() => resolve(defaultValue));
		});
	}
}
