import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Category } from 'src/app/shared/models/collections/category.model';
import { Post } from 'src/app/shared/models/collections/post.model';
import { Language } from 'src/app/shared/models/language.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoriesService } from 'src/app/shared/services/collections/categories.service';
import { PostsService } from 'src/app/shared/services/collections/posts.service';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  allPosts: Observable<any[]>;
  selectedPost: Post = null;
  dataTableTrigger: Subject<void> = new Subject();
  private subscription: Subscription = new Subscription();
  allStatus: { labels: object, colors: object };
  allCategories: Category[] = [];
  allLanguages: Language[] = [];
  private routeParamsChange: Subject<void> = new Subject<void>();
  public localPosts: any;
  isLoading: boolean = true;

  constructor(
    private auth: AuthService,
    private router: Router,
    private posts: PostsService,
    private categories: CategoriesService,
    private alert: AlertService,
    private route: ActivatedRoute,
    public navigation: NavigationService,
    public currentUser: CurrentUserService,
    protected db: DatabaseService,
  ) { }

  ngOnInit() {
    this.getPosts();
  }

  getPosts() {
    this.allPosts = this.posts.getWhereFn(ref => {
      let query: any = ref;
      query = query.orderBy('createdAt', 'desc');
      return query;
    }, true).pipe(
      map((posts: Post[]) => {
        return posts.sort((a: Post, b: Post) => b.createdAt - a.createdAt);
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.routeParamsChange.next();
  }

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigateByUrl('login');
    }).catch((error: Error) => {
      console.log(error.message);
    });
  }
}
