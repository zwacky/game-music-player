import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Content, NavController } from "ionic-angular";
import { Observable } from 'rxjs';
import { Store } from "@ngrx/store";
import { AppState } from "../../app/app.state";
import { TrackScroller } from "../../common/player/track-scroller.provider";
import { getTracksRendered } from "./home.selectors";
import { getCurrentTrack, getFaveIds } from "../../common/player/player.selectors";
import { ListSource } from "./list/list-source.enum";
import { Track } from "../../common/player/track.interface";


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
	) {
		this.tracksRendered$ = this.store.select(getTracksRendered);
		this.faveIds$ = this.store.select(getFaveIds);

		// update url everytime the track changes
		this.store.select(getCurrentTrack)
			.filter(track => track !== null)
			.subscribe(track => {
				const trackUrl = track.trackName.substr(0, track.trackName.length-4);
				location.replaceState(trackUrl);
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


