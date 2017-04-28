import { Action } from "@ngrx/store";

export class HomeActions {
	static RENDERED = 'RENDERED';

	setRendered(value: boolean): Action {
		return {
			type: HomeActions.RENDERED,
			payload: value
		};
	}
}
