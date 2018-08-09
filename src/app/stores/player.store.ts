import { FirebaseManager } from '../providers/firebase-manager.provider';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '../store';

export interface Track {
	id: Number;
	title: string;
	creator: string;
	trackName: string;
}

export enum AudioState {
	UNLOADED,
	LOADING,
	LOADED
}

class PlayerState {
	tracks: Track[] = [];
	currentTrack: Track = null;
	audioState: AudioState = AudioState.UNLOADED;
	isPlaying: boolean = false;
	trackFilter: string = '';
	// trackListDownloaded: boolean;
}

@Injectable()
export class PlayerStore extends Store<PlayerState> {

	tracks$: Observable<Track[]> = this.state$.pipe(
		map(s => s.tracks),
		distinctUntilChanged(),
	);

	selectedTrack$: Observable<Track> = this.state$.pipe(
		map(s => s.currentTrack),
		distinctUntilChanged(),
	);

	audioState$: Observable<AudioState> = this.state$.pipe(
		map(s => s.audioState),
		distinctUntilChanged(),
	);

	isPlaying$: Observable<boolean> = this.state$.pipe(
		map(s => s.isPlaying),
		distinctUntilChanged(),
	);

	trackFilter$: Observable<string> = this.state$.pipe(
		map(s => s.trackFilter),
		distinctUntilChanged(),
	);
	
	constructor(public firebaseManager: FirebaseManager) {
		super(new PlayerState());

		firebaseManager.tracks.subscribe(tracks => {
			this.setState({ ...this.state, tracks });
		});

		setTimeout(() => {
			const currentTrack: Track = {
				id: 5,
				title: 'lulzy',
				creator: 'yoyoyooy',
				trackName: 'track name',
			};
			this.setState({ ...this.state, currentTrack });
		}, 1000);
		
	}

	// ACTIONS

	selectTrack(currentTrack: Track) {
		this.setState({ ...this.state, currentTrack });
	}
	
	nextTrack(isShuffled: boolean) {}

	togglePlay() {}

}
