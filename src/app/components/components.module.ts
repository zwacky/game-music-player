import { NgModule } from '@angular/core';
import { TrackManager } from '../core/providers/track-manager.provider';
import { PlaybackControl } from './playback/playback-control.component';
import { PlaybackManager } from './playback/playback-manager.provider';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CoreModule } from '../core/core.module';
import { NavbarLogo } from '../pages/home/nav/navbar-logo.component';
import { NavbarMusicControl } from '../pages/home/nav/navbar-music-control.component';
import { NavbarSearch } from '../pages/home/nav/navbar-search.component';
import { VolumeSlider } from '../pages/home/nav/volume-slider.component';

@NgModule({
	imports: [CommonModule, IonicModule, CoreModule],
	providers: [TrackManager, PlaybackManager],
	declarations: [NavbarLogo, NavbarMusicControl, NavbarSearch, VolumeSlider, PlaybackControl],
	exports: [NavbarLogo, NavbarMusicControl, NavbarSearch, VolumeSlider, PlaybackControl],
})
export class ComponentsModule {}
