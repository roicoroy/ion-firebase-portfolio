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
  ) { }

  ngOnInit() {
    // this.allStatus = this.posts.getAllStatusWithColors();
    // this.subscription.add(
    //   this.categories.getAll().pipe(map((categories: Category[]) => {
    //     const allCategories: Category[] = [];
    //     categories.forEach((category: Category) => {
    //       allCategories[category.id] = category;
    //     });
    //     return allCategories;
    //   })).subscribe((categories: Category[]) => {
    //     this.allCategories = categories;
    //   })
    // );
    // this.subscription.add(
    //   this.route.params.subscribe((params: { status: string, categoryId: string, authorId: string }) => {
    //     this.routeParamsChange.next();
    //     this.isLoading = true;
    //     // Get all posts
    //     this.allPosts = this.posts.getWhereFn(ref => {
    //       let query: any = ref;
    //       // Filter by status
    //       if (params.status) {
    //         query = query.where('status', '==', params.status);
    //       }
    //       // Filter by category
    //       else if (params.categoryId) {
    //         query = query.where('categories', 'array-contains', params.categoryId);
    //       }
    //       // Filter by author
    //       else if (params.authorId) {
    //         query = query.where('createdBy', '==', params.authorId);
    //       }
    //       // query = query.orderBy('createdAt', 'desc'); // requires an index to work
    //       return query;
    //     }, true).pipe(
    //       map((posts: Post[]) => {
    //         return posts.sort((a: Post, b: Post) => b.createdAt - a.createdAt);
    //       }),
    //       takeUntil(this.routeParamsChange)
    //     );
    //     this.subscription.add(
    //       this.allPosts.subscribe((posts: any[]) => {
    //         this.isLoading = false;
    //       })
    //     );
    //   })
    // );
  
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
    // this.routeParamsChange.next();
  }

  logout() {
    // this.auth.signOut().then(() => {
    //   this.navigation.redirectTo('login');
    // }).catch((error: Error) => {
    //   // this.alert.error(error.message);
    //   console.log(error.message);
    // });
  }
}
