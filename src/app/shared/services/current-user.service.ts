import { Injectable } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { User, UserRole } from '../models/collections/user.model';
import { UsersService } from './collections/users.service';
import { DatabaseService } from './database.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  data: User = null;
  private dataChange: Subject<User> = new Subject<User>(); // emit User object on each user change
  private userChange: Subject<void> = new Subject<void>(); // used to stop users service subscription on each new subscription

  constructor(
    private users: UsersService,
    private db: DatabaseService
  ) {
    this.db.setCurrentUser(this);
  }

  get() {
    return this.data ? this.data : this.dataChange.pipe(take(1)).toPromise();
  }

  set(user: firebase.User) {
    this.unsubscribe();
    if (user) {
      this.users.get(user.uid).pipe(
        takeUntil(this.userChange)
      ).subscribe((user: User) => {
        if (user) {
          user.avatar = this.users.getAvatarUrl(user.avatar as string);
        }
        this.data = user;
        this.dataChange.next(this.data);
      });
    }
  }

  unsubscribe() {
    this.userChange.next();
  }

  private hasRole(role: UserRole) {
    return this.data && this.data.role === role;
  }

  isAdmin() {
    return this.hasRole(UserRole.Administrator);
  }

  isGuest() {
    return this.hasRole(UserRole.Guest);
  }

}
