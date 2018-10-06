// import { Track } from '@/pages/track.interface';
// import { Howl } from 'howler';
// import store from '@/store';

// let howler;
// let callbacks: { onTrackLoaded?; onTrackEnded?; onSeeked? } = {};
// const BASE = 'https://tracks.gamemusicplayer.io';

// const HowlerService = {
// 	init({ onTrackLoaded, onTrackEnded, onSeeked }) {
// 		callbacks = { onTrackLoaded, onTrackEnded, onSeeked };
// 	},
// 	play(track: Track, volume: number) {
// 		console.log('--', store);

// 		howler = new Howl({
// 			src: `${BASE}/${track.trackName}`,
// 			autoplay: true,
// 			volume: volume / 100,
// 			html5: true,
// 			onload: () => callbacks.onTrackLoaded(),
// 			onend: () => callbacks.onTrackEnded(),
// 			onseek: () => callbacks.onSeeked(),
// 		});
// 	},
// 	resume() {
// 		if (howler) {
// 			howler.play();
// 		}
// 	},
// 	pause() {
// 		if (howler) {
// 			howler.pause();
// 		}
// 	},
// };

// function onTrackLoaded() {
// 	// this.playerStore.setDuration(this.audio.duration());
// }

// function onTrackEnded() {
// 	// console.log('track ended');
// 	// if (this.settingsStore.state.isRepeat) {
// 	// 	this.audio.play();
// 	// } else {
// 	// 	this.playerStore.playNextTrack();
// 	// }
// 	// @tracking
// 	// this.trackCompleted(100);
// }

// /**
//  * whenever the user sought (ha! thought I didn't know the past tense of seek didcha!) on the player.
//  */
// function onSeeked() {
// 	// @tracking
// 	// used seeker to x %
// }

// export default HowlerService;
