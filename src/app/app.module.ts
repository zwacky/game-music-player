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


@NgModule({
	declarations: [
		AppComponent,
		Playback,
		HomePage,
		GameMusicList,
		GameMusicListItem,
		NavbarMusicControl,
		DurationFormatter,
	],
	imports: [
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(AppComponent, {}, {
			links: [
				// {component: HomePage, name: 'Home', segment: ':segment'}
			],
		}),
		StoreModule.provideStore(reducer),
	],
	bootstrap: [IonicApp],
	entryComponents: [
		AppComponent,
		HomePage,
	],
	providers: [
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		PlayerActions,
		HomeActions,
		GoogleAnalyticsTracker,
	]
})
export class AppModule { }
