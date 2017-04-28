import { Action } from '@ngrx/store';
import { HomeActions } from "./home.actions";

export interface HomeState {
	tracksRendered: boolean;
};

const defaultState: HomeState = {
	tracksRendered: false,
};

export function HomeReducer(state: HomeState = defaultState, action: Action): any {
	switch(action.type) {

		case HomeActions.RENDERED:
			const changedSetting = {
				tracksRendered: action.payload
			};
			return Object.assign({}, state, changedSetting);

		default:
			return state;
	}
}
