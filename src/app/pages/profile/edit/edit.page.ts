import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserRole } from 'src/app/shared/models/collections/user.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UsersService } from 'src/app/shared/services/collections/users.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
// import 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  userId: string;
  id: any;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  role: UserRole;
  allRoles: object | any = {};
  bio: string;
  private avatar: File;
  avatarSrc: string | ArrayBuffer;
  private subscription: Subscription = new Subscription();
  userData: any;

  constructor(
    private users: UsersService,
    public navigation: NavigationService,
    public activatedRoute: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    this.allRoles = this.users.getAllRoles();
    this.subscription.add(
      this.activatedRoute.queryParams
        .subscribe((params: any) => {
          this.users.get(params.userId)
            .pipe(take(1))
            .toPromise()
            .then((user: any) => {
              if (user) {
                this.userData = user;
                this.id = params;
                this.firstName = user.firstName;
                this.lastName = user.lastName;
                this.email = user.email;
                this.password = user.password;
                this.birthDate = user.birthDate ? new Date(user.birthDate).toISOString().slice(0, 10) : null;
                this.role = user.role;
                this.bio = user.bio;
                this.avatar = null;
                this.subscription.add(
                  this.users.getAvatarUrl(user.avatar as string)
                    .subscribe((imageUrl: string) => {
                      this.avatarSrc = imageUrl;
                    })
                );
              }
              else {
                console.error('else...')
              }
            });
        })
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onAvatarChange(event: Event) {
    this.avatar = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarSrc = reader.result;
    };
    reader.readAsDataURL(this.avatar);
  }
  updateUser(event: Event, form: HTMLFormElement) {
    form.isSubmitted = true;
    if (form.checkValidity()) {
      const data: any = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        birthDate: this.birthDate ? new Date(this.birthDate).getTime() : null,
        role: this.role,
        bio: this.bio
      };
      if (this.avatar) {
        data.avatar = this.avatar;
      }
      this.users.edit(this.id.userId, data, {
        email: this.userData.email,
        password: this.userData.password
      }).then(() => {
        this.userData = { ...this.userData, ...data };
      }).catch((error: Error) => {
        console.error(error);
      }).finally(() => {
        // console.log('finally');
        return this.router.navigateByUrl('profile');
      });
    }
  }
  navigateBack() {
    return this.router.navigateByUrl('profile');
  }
}
