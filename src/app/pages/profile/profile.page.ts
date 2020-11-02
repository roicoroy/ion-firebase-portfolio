import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { User } from 'firebase';
import { Observable, Subscription, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Category } from 'src/app/shared/models/collections/category.model';
import { Post, PostStatus } from 'src/app/shared/models/collections/post.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoriesService } from 'src/app/shared/services/collections/categories.service';
import { PagesService } from 'src/app/shared/services/collections/pages.service';
import { PostsService } from 'src/app/shared/services/collections/posts.service';
import { UsersService } from 'src/app/shared/services/collections/users.service';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  user: any;
  allRoles: object = {};
  latestPosts: Observable<any[]>;
  postsLanguage: string;

  allPostsStatus: { labels: object, colors: object };
  allPostsCategories: Category[] = [];
  private subscription: Subscription = new Subscription();
  private routeParamsChange: Subject<void> = new Subject<void>();
  private postsLanguageChange: Subject<void> = new Subject<void>();
  statistics: { posts?: number, publishedPosts?: number, comments?: number, pages?: number } = {};
  userID;

  constructor(
    public navigation: NavigationService,
    private users: UsersService,
    private posts: PostsService,
    private categories: CategoriesService,
    private pages: PagesService,
    private currentUser: CurrentUserService,
    public modalController: ModalController,
    private router: Router,
    private auth: AuthService,
    private theme: ThemeService
  ) { }

  enableDark() {
    this.theme.enableDark();
    // localStorage.setItem('theme', 'dark');
  }
  enableLight() {
    this.theme.enableLight();
    // localStorage.setItem('theme', 'light');
  }
  update(e) {
    e.detail.checked ? this.enableDark() : this.enableLight();
  }


  navigateToEdit(userId) {
    this.router.navigate(['edit'], {
      queryParams: { "userId": userId }
    });
  }
  ionViewWillEnter() {
    this.allRoles = this.users.getAllRoles();
    this.allPostsStatus = this.posts.getAllStatusWithColors();
    this.subscription.add(
      this.categories.getAll().pipe(map((categories: Category[]) => {
        const allCategories: Category[] = [];
        categories.forEach((category: Category) => {
          allCategories[category.id] = category;
        });
        return allCategories;
      })).subscribe((categories: Category[]) => {
        this.allPostsCategories = categories;
      })
    );
    this.userID = this.currentUser.data?.id;
    this.subscription.add(
      this.users.get(this.userID).pipe(
        map((user: any) => {
          user.avatar = this.users.getAvatarUrl(user.avatar as string);
          return user;
        }),
        takeUntil(this.routeParamsChange)
      ).subscribe((user: User) => {
        if (user) {
          this.user = user;
          this.user.id = this.userID;
          this.getStatistics();
          this.getLatestPosts();
        }
        else {
          console.error('no user...');
        }
      })
    );
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.routeParamsChange.next();
    this.postsLanguageChange.next();
  }
  private getLatestPosts() {
    this.latestPosts = this.posts.getWhereFn(ref => {
      let query: any = ref;
      query = query.where('createdBy', '==', this.user.id);
      // Filter by lang
      // if (this.postsLanguage !== '*') {
      //   query = query.where('lang', '==', this.postsLanguage);
      // }
      // orderBy & limit requires a database index to work with the where condition above
      // as a workaround, they were replaced with client side sort/slice functions below
      // query = query.orderBy('createdAt', 'desc');
      // query = query.limit(5);
      return query;
    }, true)
      .pipe(
        map((posts: Post[]) => {
          return posts.sort((a: Post, b: Post) => b.createdAt - a.createdAt).slice(0, 5);
        }),
        takeUntil(this.postsLanguageChange),
      );
  }
  onPostsLanguageChange() {
    this.postsLanguageChange.next();
    this.getLatestPosts();
  }
  private async getStatistics() {
    if (this.user && this.user.id) {
      this.statistics.posts = await this.posts.countWhere('createdBy', '==', this.user.id);
      const publishedPosts = await this.posts.countWhereFn(ref => ref.where('createdBy', '==', this.user.id).where('status', '==', PostStatus.Published));
      this.statistics.publishedPosts = Math.round((publishedPosts / this.statistics.posts) * 100);
      this.statistics.comments = 0;
      this.statistics.pages = await this.pages.countWhere('createdBy', '==', this.user.id);
    }
  }
  canEditProfile() {
    // return true;
    return !this.currentUser.isGuest();
  }
  logout() {
    this.auth.signOut().then(() => {
      // this.navigation.redirectTo('login');
      this.router.navigateByUrl('login');
    }).catch((error: Error) => {
      console.log(error.message);
    });
  }
}
