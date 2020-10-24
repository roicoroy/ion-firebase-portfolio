import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { ConfigService } from '../services/collections/config.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterGuard implements CanActivate {

  constructor(
    private navigation: NavigationService,
    private config: ConfigService,
    private router: Router

  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const registrationEnabled = await this.config.isRegistrationEnabled();
      //console.log(registrationEnabled);
      if (registrationEnabled) {
        resolve(true);
      } else {
        // this.router.navigateByUrl('login');
        this.navigation.redirectTo('login');
        resolve(false);
      }
    });
  }

}
