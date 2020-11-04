import { Component, OnInit } from '@angular/core';

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
import { ThemeService } from './shared/services/theme.service';
import { Storage } from '@ionic/storage';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'paper-plane'
    },
  ];
  constructor(
    private platform: Platform,
    private auth: AuthService,
    public navigation: NavigationService,
    public currentUser: CurrentUserService,
    private theme: ThemeService,
    private storage: Storage
  ) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      SplashScreen.show({
        showDuration: 2000,
        autoHide: true
      });
      this.storage.ready().then(() => {
        this.storage.get('theme').then((theme) => {
          console.log(theme);
          if (theme === 'light' || theme === null || theme === undefined) {
            return this.theme.enableLight();
          }
          if (theme === 'dark') {
            return this.theme.enableDark();
          }
        })
      })
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
