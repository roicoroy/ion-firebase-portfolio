import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  @Input() imagesArray: any = [];
  @Input() index: number;
  localArray = [];
  detailImage;
  constructor(
    public modalController: ModalController,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.localArray = this.imagesArray;
    // console.log(this.index);
    // console.log(this.imagesArray[1]);
    this.imagesArray.forEach(images => {
      this.localArray.push(images);
      console.log(this.localArray);
    });
    this.detailImage = this.getDetailImage(this.index);
    console.log(this.detailImage);
  }
  getDetailImage(index) {
    return this.imagesArray[index];
  }
  closeModal() {
    this.modalController.dismiss();
    this.imagesArray = [];
  }
}
