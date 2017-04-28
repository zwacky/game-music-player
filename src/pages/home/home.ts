import { Component, ViewChild } from '@angular/core';
import { Content } from "ionic-angular";
import { Observable } from 'rxjs';
import { Store } from "@ngrx/store";
import { AppState } from "../../app/app.state";
import { TrackScroller } from "../../common/player/track-scroller.provider";
import { getTracksRendered } from "./home.selectors";


@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	@ViewChild(Content) content: Content;

	public segment = '';
	public tracksRendered$: Observable<boolean>;


	constructor(
		private store: Store<AppState>,
	) {
		this.tracksRendered$ = this.store.select(getTracksRendered);
	}

	ngAfterViewInit() {
		// setting content for scroller
		TrackScroller.content = this.content;

		this.tracksRendered$
			.filter(Boolean)
			.subscribe(() => TrackScroller.scrollToSelectedTrack());
	}

}


