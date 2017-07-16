import { Component } from '@angular/core';

@Component({
	selector: 'navbar-logo',
	template: `
		<div style="display: inline-block; height: 100%; padding: 15px 0 0 15px;">
			<img
				src="/assets/logo/gamemusicplayer-logo.png"
				alt="Game Music Player"
				title="Game Music Player"
				style="display: inline-block; vertical-align: middle; width: 40px; border: 1px solid #29434e; border-radius: 50%;;">
		</div>
	`
})
export class NavbarLogo {
	constructor() {}
}
