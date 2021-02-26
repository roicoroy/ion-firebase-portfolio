import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { NavigationService } from './shared/services/navigation.service';
import { CurrentUserService } from './shared/services/current-user.service';
import { UsersService } from './shared/services/collections/users.service';
import { User } from 'firebase';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { fadeAnimation } from './app-routing.animations';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [fadeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    // {
    //   title: 'Profile',
    //   url: '/profile',
    //   icon: 'paper-plane'
    // },
  ];
  public AppCategories = [
    {
      id:1,
      name: 'Local'
    },
    {
      id:2,
      name: 'Artistic Photos'
    },
    {
      id:3,
      name: 'Business'
    }
  ]
  constructor(
    private platform: Platform,
    private auth: AuthService,
    public navigation: NavigationService,
    public currentUser: CurrentUserService,
  ) {
    this.initializeApp();
  }  
  initializeApp() {
    this.platform.ready().then(() => {
      SplashScreen.show({
        showDuration: 2000,
        autoHide: true
      });
    });
  }
  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
  logout() {
    this.auth.signOut().then(() => {
      this.navigation.redirectTo('login');
    }).catch((error: Error) => {
      console.log(error.message);
    });
  }
}
