import { HomeState } from "../pages/home/home.reducer";
import { PlayerState } from "../common/player/player.reducer";

export interface AppState {
	player: PlayerState;
	home: HomeState;
}
