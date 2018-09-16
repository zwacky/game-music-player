import { FirebaseManager } from '../providers/firebase-manager.provider';
import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { Store } from '../store';
import { TrackManager } from '../providers/track-manager.provider';
import { Track } from '../interfaces/track';

export enum AudioState {
	UNLOADED,
	LOADING,
	LOADED,
}

class PlayerState {
	tracks: Track[] = [];
	currentTrack: Track = null;
	// currentTrackSeeker: number = 0;
	elapsedSeconds: number = 0;
	currentTrackWantedSeeker: number = 0; // user wants to change seeker to this value
	currentTrackDuration: number = 0;
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

	isPlaying$: Observable<boolean> = this.state$.pipe(
		// only next it when audio has been loaded
		map(s => s.isPlaying),
		distinctUntilChanged()
	);

	currentTrackDuration$: Observable<number> = this.state$.pipe(
		map(s => s.currentTrackDuration),
		distinctUntilChanged()
	);

	// currentTrackSeeker$: Observable<number> = this.state$.pipe(
	// 	map(s => s.currentTrackSeeker),
	// 	distinctUntilChanged()
	// );

	elapsedSeconds$: Observable<number> = this.state$.pipe(
		map(s => s.elapsedSeconds),
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
		const nextTrack = this.trackManager.getNextTrack(
			this.state.tracks,
			this.state.currentTrack
		);
		this.selectTrack(nextTrack);
	}

	setDuration(currentTrackDuration: number) {
		this.setState({ ...this.state, currentTrackDuration });
	}

	/**
	 * visually update the seeker, coming from the media player.
	 */
	// setCurrentTrackSeeker(currentTrackSeeker: number) {
	// 	this.setState({ ...this.state, currentTrackSeeker });
	// }

	setElapsedSeconds(elapsedSeconds: number): any {
		this.setState({ ...this.state, elapsedSeconds });
	}

	/**
	 * the user wants to change the seeker to this value.
	 */
	setCurrentTrackWantedSeeker(currentTrackWantedSeeker: number) {
		this.setState({ ...this.state, currentTrackWantedSeeker });
	}

	togglePlay(triggeredBy = 'click') {
		if (!this.state.currentTrack) {
			this.playNextTrack();
		} else {
			const isPlaying = !this.state.isPlaying;
			this.setState({ ...this.state, isPlaying });
		}
	}
}
