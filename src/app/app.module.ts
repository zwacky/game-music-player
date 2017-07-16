import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { HomePage } from '../pages/home/home';
import { GameMusicList } from "../pages/home/list/game-music-list.component";
import { StoreModule } from '@ngrx/store';
import { NavbarMusicControl } from "../pages/home/nav/navbar-music-control.component";
import { Playback } from "../common/player/playback.component";
import { GameMusicListItem } from "../pages/home/list/game-music-list-item.component";
import { reducer } from "./app.reducers";
import { PlayerActions } from "../common/player/player.actions";
import { HomeActions } from "../pages/home/home.actions";
import { GoogleAnalyticsTracker } from "../common/tracking/google-analytics-tracker.provider";
import { DurationFormatter } from "../common/pipes/duration-formatter";
import { VolumeSlider } from "../common/player/volume-slider/volume-slider.component";
import { StorageManager } from "../common/storage/storage-manager.provider";
import { NavbarSearch } from "../pages/home/nav/navbar-search.component";
import { NavbarLogo } from "../pages/home/nav/navbar-logo.component";


@NgModule({
	declarations: [
		AppComponent,
		HomePage,
		VolumeSlider,
		Playback,
		GameMusicList,
		GameMusicListItem,
		NavbarMusicControl,
		NavbarSearch,
		NavbarLogo,
		DurationFormatter,
	],
	imports: [
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(AppComponent, {}, {
			links: [
				{component: HomePage, name: 'Home', segment: ':trackName'}
			],
		}),
		StoreModule.provideStore(reducer),
	],
	bootstrap: [IonicApp],
	entryComponents: [
		AppComponent,
		HomePage,
		VolumeSlider,
	],
	providers: [
		// {provide: LocationStrategy, useClass: PathLocationStrategy}, // when not using shebangs as location
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		PlayerActions,
		HomeActions,
		GoogleAnalyticsTracker,
		StorageManager,
	]
})
export class AppModule { }
