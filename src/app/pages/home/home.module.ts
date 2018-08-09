import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
// import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { PlayerStore } from '../../stores/player.store';
import { TrackList } from '../../list/track-list.component';
import { FirebaseManager } from '../../providers/firebase-manager.provider';

@NgModule({
	imports: [
		CommonModule,
		// FormsModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: '',
				component: HomePage,
			},
		]),
	],
	declarations: [HomePage, TrackList],
	providers: [PlayerStore, FirebaseManager],
})
export class HomePageModule {}
