import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { Category } from 'src/app/shared/models/collections/category.model';
import { Post } from 'src/app/shared/models/collections/post.model';

import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoriesService } from 'src/app/shared/services/collections/categories.service';
import { PostsService } from 'src/app/shared/services/collections/posts.service';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
declare var $: any;
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Gallery, GalleryConfig, GalleryItem, ImageItem, ThumbnailsPosition } from 'src/app/shared/ng-gallery/src/public-api';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Lightbox } from 'src/app/shared/ng-gallery/lightbox/src/public_api';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  allPosts: any;
  private subscription: Subscription = new Subscription();
  public localPosts: any;
  isLoading: boolean = true;
  postsArray: any = [];
  imagesArray: any = [];
  items: GalleryItem[];
  imageSrc: GalleryItem[];
  map1: any = [];
  readonly posts$: Observable<GalleryItem[]>;
  readonly media$: Observable<GalleryConfig>;
  constructor(
    private auth: AuthService,
    private router: Router,
    private posts: PostsService,
    public navigation: NavigationService,
    public currentUser: CurrentUserService,
    protected db: DatabaseService,
    public modalController: ModalController,
    private fbStorage: StorageService,
    public gallery: Gallery,
    public lightbox: Lightbox,
    private mediaObserver: MediaObserver,
  ) {
    this.media$ = mediaObserver.asObservable().pipe(
      map((res: MediaChange[]) => {
        if (res.some((x => x.mqAlias === 'sm' || x.mqAlias === 'xs'))) {
          return {
            thumbPosition: ThumbnailsPosition.Right,
            thumbWidth: 120,
            thumbHeight: 90
          };
        }
        return {
          thumbPosition: ThumbnailsPosition.Left,
          thumbWidth: 120,
          thumbHeight: 90
        };
      })
    );
  }
  navigateToEdit(id) {
    this.router.navigate(['details'], {
      queryParams: { "id": id }
    });
  }

  ngOnInit() {
    this.getPosts();
  }
  openLightbox(index) {
    return this.lightbox.open(index, 'lightbox');
  }

  getPosts() {
    this.allPosts = this.posts.getAll().pipe(
      map((posts: Post[]) => {
        let sortedPosts: any = posts.sort((a: Post, b: Post) => b.createdAt - a.createdAt);
        this.imagesArray = [].concat(sortedPosts);
        this.imagesArray.map(x => {
          this.posts.getImageUrl(x.image.path as string).subscribe((res) => {
            this.map1.push(new ImageItem({ src: res, thumb: res }));
            this.imageSrc = [].concat(...this.map1);
            return this.imageSrc;
          });
        });
      }),
    ); 
  }

  openGallery() {
    this.gallery.ref('lightbox', {
      thumbPosition: 'bottom',
      imageSize: 'cover',
    }).load(this.imageSrc);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.gallery.ref('lightbox').destroy();
  }

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigateByUrl('login');
    }).catch((error: Error) => {
      console.log(error.message);
    });
  }
}
