import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { DetailsComponent } from './details-component/details.component';
import { GalleryModule } from 'src/app/shared/ng-gallery/src/public-api';
import { LightboxModule } from 'src/app/shared/ng-gallery/lightbox/src/public_api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    GalleryModule,
    // LightboxModule,
    LightboxModule.withConfig({
      keyboardShortcuts: false
    }),
  ],
  declarations: [
    HomePage,
    DetailsComponent
  ],
  entryComponents:[
    DetailsComponent
  ]
})
export class HomePageModule {}
