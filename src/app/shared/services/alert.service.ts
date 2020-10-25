import { Injectable } from "@angular/core";
import { AlertController } from '@ionic/angular';
import { AlertType } from '../models/alert-type.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  message: string = null;
  type: AlertType = 'primary';
  icon: string = null;
  isPersistent: boolean = false;
  private timeoutHandle: any = null;

  constructor(
    public alertController: AlertController
  ) { }

}
