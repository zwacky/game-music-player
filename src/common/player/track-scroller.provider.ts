import { Content } from "ionic-angular";

export class TrackScroller {

	static content: Content;

	static scrollToSelectedTrack(selectedClass = '.game-music-list-item--selected'): void {
		[].filter.call([document.querySelector(selectedClass)], elem => elem)
			.forEach(elem => {
				const top = elem.offsetTop;
				this.content.scrollTo(0, top, 600);
			});
	}

}
