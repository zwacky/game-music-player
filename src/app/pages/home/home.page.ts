import { Component } from '@angular/core';
import { PlayerStore } from '../../core/stores/player.store';

@Component({
	selector: 'app-page-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {
	constructor(public playerStore: PlayerStore) {}
}
