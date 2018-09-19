import { Track } from "../../../core/interfaces/track";

export interface BufferedTrack extends Track {
	isFaved: boolean;
	isPlaying: boolean;
	isCurrentTrack: boolean;
}