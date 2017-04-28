import { createSelector } from 'reselect';
import { AppState } from "../../app/app.state";
import { HomeState } from "./home.reducer";

export function getHomeState(state: AppState): HomeState {
	return state.home;
};

export function fetchTracksRendered(state: HomeState) {
	return state.tracksRendered;
}


// *************************** PUBLIC API's ****************************
export const getTracksRendered = createSelector(getHomeState, fetchTracksRendered);
