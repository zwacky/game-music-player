import { PlayerReducer } from "../common/player/player.reducer";
import { HomeReducer } from "../pages/home/home.reducer";
import { ActionReducer, combineReducers } from "@ngrx/store";
import {  storeFreeze } from 'ngrx-store-freeze';
import { compose } from "@ngrx/core";
import { AppState } from "./app.state";

const reducers = {
	player: PlayerReducer,
	home: HomeReducer,
};

export const developmentReducer: ActionReducer<AppState> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<AppState> = combineReducers(reducers);

export function reducer(state: any, action: any) {
	// TODO set reducers according to environment (dev, prod)
	const environment = 'dev';
	return (environment === 'dev') ?
		productionReducer(state, action) :
		developmentReducer(state, action);
}
