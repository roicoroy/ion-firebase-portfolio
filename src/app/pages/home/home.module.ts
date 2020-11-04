import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { LightboxModule } from 'src/app/shared/ng-gallery/lightbox/src/public_api';
import { GalleryModule } from 'src/app/shared/ng-gallery/src/public-api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    GalleryModule,
    // LightboxModule.withConfig({
    //   keyboardShortcuts: false
    // }),
    LightboxModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
