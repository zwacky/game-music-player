import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ComponentsModule } from '../../components/components.module';
import { CoreModule } from '../../core/core.module';
import { TrackList } from './list/track-list.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		CoreModule,
		ComponentsModule,
		RouterModule.forChild([
			{
				path: '',
				component: HomePage,
			},
		]),
	],
	declarations: [HomePage, TrackList],
})
export class HomePageModule {}
