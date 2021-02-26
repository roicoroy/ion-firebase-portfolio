import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
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
import { DetailsComponent } from './details-component/details.component';
declare var $: any;
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Gallery, GalleryItem, ImageItem } from 'src/app/shared/ng-gallery/src/public-api';
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
  ) { }
  navigateToEdit(id) {
    this.router.navigate(['details'], {
      queryParams: { "id": id }
    });
  }

  ngOnInit() {
    this.getPosts();
  }

  getPosts() {
    this.allPosts = this.posts.getAll().pipe(
      map((posts: Post[]) => {
        // let myPosts: any = posts.sort((a: Post, b: Post) => b.createdAt - a.createdAt);
        this.imagesArray = [].concat(posts);
        this.imagesArray.map(x => {
          this.posts.getImageUrl(x.image.path as string).subscribe((res) => {
            this.map1.push(new ImageItem({ src: res, thumb: res }));
            this.imageSrc = [].concat(...this.map1);
            console.log(this.imageSrc)
            return this.imageSrc;
          });
        });
        return this.imageSrc;
      }),
    );
    // return this.allPosts;
  }

  openGallery() {
    this.gallery.ref('lightbox', {
      thumbPosition: 'top',
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
