import { FirebaseManager } from '../providers/firebase-manager.provider';
import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { Store } from '../store';
import { PlaybackManager } from '../common/playback/playback-manager.provider';
import { TrackManager } from '../providers/track-manager.provider';
import { Track } from '../common/track';

export enum AudioState {
	UNLOADED,
	LOADING,
	LOADED,
}

class PlayerState {
	tracks: Track[] = [];
	currentTrack: Track = null;
	currentTrackSeeker: number = 0;
	currentTrackWantedSeeker: number = 0; // user wants to change seeker to this value
	currentTrackDuration: number = 0;
	// audioState: AudioState = AudioState.UNLOADED;
	isPlaying: boolean = false;
	trackFilter: string = '';
}

@Injectable()
export class PlayerStore extends Store<PlayerState> {
	tracks$: Observable<Track[]> = this.state$.pipe(
		map(s => s.tracks),
		distinctUntilChanged()
	);

	trackFilter$: Observable<string> = this.state$.pipe(
		map(s => s.trackFilter),
		distinctUntilChanged()
	);

	filteredTracks$: Observable<Track[]> = combineLatest(
		this.tracks$,
		this.trackFilter$,
		(tracks, trackFilter) =>
			tracks.filter(
				track =>
					track.creator.toLowerCase().indexOf(trackFilter.toLowerCase()) !== -1 ||
					track.trackName.toLowerCase().indexOf(trackFilter.toLowerCase()) !== -1
			)
	);

	currentTrack$: Observable<Track> = this.state$.pipe(
		map(s => s.currentTrack),
		filter(s => !!s),
		distinctUntilChanged()
	);

	/**
	 * resembles the state of the html5 player.
	 */
	// audioState$: Observable<AudioState> = this.state$.pipe(
	// 	map(s => s.audioState),
	// 	distinctUntilChanged()
	// );

	isPlaying$: Observable<boolean> = this.state$.pipe(
		 // only next it when audio has been loaded
		map(s => s.isPlaying),
		distinctUntilChanged()
	);

	/**
	 * only send when the audio has been loaded.
	 */
	// isPlaying$: Observable<boolean> = combineLatest(
	// 	this.audioState$,
	// 	this.state$.pipe(
	// 		map(s => s.isPlaying),
	// 		distinctUntilChanged()
	// 	),
	// 	(audioState, isPlaying) => audioState === AudioState.LOADED
	// );

	currentTrackDuration$: Observable<number> = this.state$.pipe(
		map(s => s.currentTrackDuration),
		distinctUntilChanged()
	);

	currentTrackSeeker$: Observable<number> = this.state$.pipe(
		map(s => s.currentTrackSeeker),
		distinctUntilChanged()
	);

	currentTrackWantedSeeker$: Observable<number> = this.state$.pipe(
		map(s => s.currentTrackWantedSeeker),
		distinctUntilChanged()
	);

	constructor(private firebaseManager: FirebaseManager, private trackManager: TrackManager) {
		super(new PlayerState());

		firebaseManager.tracks.subscribe(tracks => {
			this.setState({ ...this.state, tracks });
		});
	}

	// ACTIONS

	/**
	 * @param currentTrack Track
	 */
	selectTrack(currentTrack: Track) {
		const isPlaying = true;
		this.setState({ ...this.state, currentTrack, isPlaying });
	}

	setTrackFilter(trackFilter: string) {
		this.setState({ ...this.state, trackFilter });
	}

	playNextTrack() {
		const nextTrack = this.trackManager.getNextTrack(this.state.tracks, this.state.currentTrack);
		this.selectTrack(nextTrack);
	}

	setDuration(currentTrackDuration: number) {
		this.setState({ ...this.state, currentTrackDuration });
	}

	/**
	 * visually update the seeker, coming from the media player.
	 */
	setCurrentTrackSeeker(currentTrackSeeker: number) {
		this.setState({ ...this.state, currentTrackSeeker });
	}

	/**
	 * the user wants to change the seeker to this value.
	 */
	setCurrentTrackWantedSeeker(currentTrackWantedSeeker: number) {
		this.setState({ ...this.state, currentTrackWantedSeeker });
	}

	// setAudioState(audioState: AudioState) {
	// 	this.setState({ ...this.state, audioState });
	// }

	togglePlay(triggeredBy = 'click') {
		if (!this.state.currentTrack) {
			this.playNextTrack();
		} else {
			const isPlaying = !this.state.isPlaying;
			this.setState({ ...this.state, isPlaying });
		}
	}
}
