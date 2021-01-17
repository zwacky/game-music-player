import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Content, NavController, ToastController } from "ionic-angular";
import { Observable } from 'rxjs/Observable';
import { Store } from "@ngrx/store";
import { AppState } from "../../app/app.state";
import { TrackScroller } from "../../common/player/track-scroller.provider";
import { getTracksRendered } from "./home.selectors";
import { getCurrentTrack, getFaveIds } from "../../common/player/player.selectors";
import { ListSource } from "./list/list-source.enum";


@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	@ViewChild(Content) content: Content;

	public segment = '';
	public tracksRendered$: Observable<boolean>;
	public sources = ListSource;
	public faveIds$: Observable<string[]>;

	constructor(
		private store: Store<AppState>,
		private navCtrl: NavController,
		private location: Location,
		private toastCtrl: ToastController,
	) {
		this.tracksRendered$ = this.store.select(getTracksRendered);
		this.faveIds$ = this.store.select(getFaveIds);

		// update url everytime the track changes
		this.store.select(getCurrentTrack)
			.filter(track => track !== null)
			.subscribe(track => {
				const trackUrl = track.file.substr(0, track.file.length-4);
				location.replaceState(trackUrl);
			});
	}

	ngOnInit() {

		// listen to the service worker promise in index.html to see if there has been a new update.
		// condition: the service-worker.js needs to have some kind of change - e.g. increment CACHE_VERSION.
		window['isUpdateAvailable']
			.then(isAvailable => {
				if (isAvailable) {
					const toast = this.toastCtrl.create({
						message: 'New Update available! Reload the webapp to see the latest juicy changes.',
						position: 'bottom',
						showCloseButton: true,
					});
					toast.present();
				}
			});
	}

	ngAfterViewInit() {
		// setting content for scroller
		TrackScroller.content = this.content;
		TrackScroller.store = this.store;

		// this.tracksRendered$
		// 	.filter(Boolean)
		// 	.subscribe(() => TrackScroller.scrollToSelectedTrack());
	}

}


