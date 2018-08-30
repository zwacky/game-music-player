import { SettingsStore } from './../../stores/settings.store';
import { NavbarMusicControl } from './../../common/nav/navbar-music-control.component';
import { NavbarSearch } from '../../common/nav/navbar-search.component';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { PlayerStore } from '../../stores/player.store';
import { TrackList } from '../../list/track-list.component';
import { FirebaseManager } from '../../providers/firebase-manager.provider';
import { NavbarLogo } from '../../common/nav/navbar-logo.component';
import { StorageManager } from '../../common/storage-manager.provider';
import { GoogleAnalyticsTracker } from '../../common/google-analytics-tracker.provider';
import { VolumeSlider } from '../../common/nav/volume-slider.component';
import { PlaybackManager } from '../../common/playback/playback-manager.provider';
import { PlaybackControl } from '../../common/playback/playback-control.component';
import { TrackManager } from '../../providers/track-manager.provider';
import { FromSeconds } from '../../common/pipes/from-seconds.pipe';
import { UserDataStore } from '../../stores/user-data.store';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: '',
				component: HomePage,
			},
		]),
	],
	entryComponents: [VolumeSlider, PlaybackControl],
	declarations: [
		HomePage,
		TrackList,
		NavbarSearch,
		NavbarLogo,
		NavbarMusicControl,
		VolumeSlider,
		PlaybackControl,
		FromSeconds
	],
	providers: [
		PlayerStore,
		SettingsStore,
		UserDataStore,
		FirebaseManager,
		StorageManager,
		GoogleAnalyticsTracker,
		PlaybackManager,
		TrackManager
	],
})
export class HomePageModule {}
