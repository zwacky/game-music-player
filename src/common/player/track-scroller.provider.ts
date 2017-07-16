import { Content } from "ionic-angular";
import { GameMusicProvider } from "../../pages/home/list/game-music.provider";
import { Store } from "@ngrx/store";
import { AppState } from "../../app/app.state";
import { getCurrentTrack } from "./player.selectors";
import '../rxjs.deps';

export class TrackScroller {

	static content: Content;
	static store: Store<AppState>;

	static scrollToSelectedTrack(selectedClass = '.game-music-list-item--selected'): void {
		const ROW_HEIGHT = 48;
		this.store.select(getCurrentTrack)
			.first()
			.subscribe(currentTrack => {
				const trackIndex = GameMusicProvider.data.tracks
					.reduce((obj, item, index) => {
						return (item === currentTrack) ?
							index :
							obj;
					}, 0);
				this.content.scrollTo(0, trackIndex * ROW_HEIGHT, 600);
			});
	}

}
