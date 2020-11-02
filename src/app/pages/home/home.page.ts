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
import { GalleryItem, ImageItem } from 'src/app/shared/ng-gallery/src/public-api';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  allPosts: Observable<any[]>;
  private subscription: Subscription = new Subscription();
  public localPosts: any;
  isLoading: boolean = true;
  postsArray: any = [];
  imagesArray: any = [];
  constructor(
    private auth: AuthService,
    private router: Router,
    private posts: PostsService,
    public navigation: NavigationService,
    public currentUser: CurrentUserService,
    protected db: DatabaseService,
    public modalController: ModalController
  ) { }

  async presentModal(imagesArray: any = [], index) {
    const modal = await this.modalController.create({
      component: DetailsComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        imagesArray,
        index
      }
    });
    return await modal.present();
  }

  navigateToEdit(id) {
    this.router.navigate(['details'], {
      queryParams: { "id": id }
    });
  }
  images: any = '';
  ngOnInit() {
    this.getPosts();
  }
  imageSrc: any;
  map1: any
  getPosts() {
    this.allPosts = this.posts.getWhereFn(ref => {
      let query: any = ref;
      query = query.orderBy('createdAt', 'desc');
      return query;
    }, true).pipe(
      map((posts: Post[]) => {
        let myPosts: any = posts.sort((a: Post, b: Post) => b.createdAt - a.createdAt);
        this.imagesArray = [].concat(myPosts);
        this.imagesArray.map(x => {
          // console.log(x);
          this.posts.getImageUrl(x.image.path as string).subscribe((res) => {
            this.map1 = new ImageItem({ src: res, thumb: res });
            this.imageSrc = [].concat(...this.map1);
            console.log(this.imageSrc);
          });
          // .pipe(take(1))
          // .toPromise().then((imageUrl: any) => {
          //   let concatUrlArray =([(imageUrl)]);
          //   // concatUrlArray.forEach(el => {
          //   //   let myObj:any = new ImageItem({ src: el, thumb: el });
          //   //   console.log([...myObj]);
          //   // });
          //   // this.map1 = [].concat(myObj);
          //   console.log(concatUrlArray);
          //   // return this.map1 = new ImageItem({ src: imageUrl, thumb: imageUrl })
          // });
        });
        // console.log(this.map1);
        // console.log(this.imagesArray);
        return myPosts;
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigateByUrl('login');
    }).catch((error: Error) => {
      console.log(error.message);
    });
  }
}
