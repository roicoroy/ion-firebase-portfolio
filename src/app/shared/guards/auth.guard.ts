import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const isSignedIn = await this.auth.isSignedIn();
      if (!isSignedIn) {
        this.router.navigateByUrl('login');
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }

}
