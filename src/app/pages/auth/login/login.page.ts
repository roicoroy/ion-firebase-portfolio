import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { getLogo } from 'src/app/shared/helpers/assets.helper';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  logo: string = getLogo();
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  error: string = null;
  private routeSubscription: Subscription = null;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private navigation: NavigationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe((params: any) => {
      if (params.email) {
        this.email = params.email;
      }
      if (params.password) {
        this.password = params.password;
      }
    });
  }
  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  onSubmit() {
    this.auth.signIn(this.email, this.password, this.rememberMe).then(() => {
      // this.navigation.redirectTo('home');
      this.router.navigateByUrl('home');
    }).catch((error: Error) => {
      this.error = error.message;
    });
  }
  goRegister() {
    this.router.navigateByUrl('register');
  }
}
