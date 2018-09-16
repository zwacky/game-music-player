import { NgModule } from '@angular/core';
import { PlayerStore } from './stores/player.store';
import { SettingsStore } from './stores/settings.store';
import { UserDataStore } from './stores/user-data.store';
import { FromSecondsPipe } from './pipes/from-seconds.pipe';
import { FirebaseManager } from './providers/firebase-manager.provider';
import { GoogleAnalyticsTracker } from './providers/google-analytics-tracker.provider';
import { TrackManager } from './providers/track-manager.provider';
import { StorageManager } from './providers/storage-manager.provider';

@NgModule({
	providers: [
		PlayerStore,
		SettingsStore,
		UserDataStore,
		FirebaseManager,
		GoogleAnalyticsTracker,
		TrackManager,
		StorageManager,
	],
	declarations: [FromSecondsPipe],
	exports: [FromSecondsPipe],
})
export class CoreModule {}
