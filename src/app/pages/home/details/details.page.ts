import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { getEmptyImage } from 'src/app/shared/helpers/assets.helper';
import { Post } from 'src/app/shared/models/collections/post.model';
import { PostsService } from 'src/app/shared/services/collections/posts.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  post: Observable<any[]>;
  id;
  constructor(
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private posts: PostsService,
  ) { }
  imageSrc: string | ArrayBuffer;
  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe((params: { id: string }) => {
        this.posts.get(params.id)
          .pipe(take(1))
          .toPromise().then((post: Post) => {
            if (post) {
              this.id = post.id;
              // this.title = post.title;
              // this.editor.root.innerHTML = post.content;
              // this.status = post.status;
              // this.slug = post.slug;
              // this.date = new Date(post.date).toISOString().slice(0, 10);
              // this.language = post.lang;
              // this.image = null;
              this.imageSrc = getEmptyImage();
              if (post.image) {
                console.log(post.image);
                this.posts.getImageUrl(post.image as string).pipe(take(1)).toPromise().then((imageUrl: string) => {
                  this.imageSrc = imageUrl;
                  console.log(this.imageSrc);
                });
              }
            } else {
              console.error('no-data');
            }
          });
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  back() {
    this.router.navigateByUrl('home');
  }
}
