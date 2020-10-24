import { Injectable } from '@angular/core';
import { DatabaseService } from '../database.service';
import { resolve } from '../../helpers/functions.helper';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // ToDo: Add/save the rest of settings in database & make them global for all users?

  constructor(
    private db: DatabaseService
  ) { }

  getAll() {
    return this.db.getCollectionRef('config').get().toPromise();
  }

  async get(documentPath: string, ...keys: string[]) {
    const doc = await this.db.getDocumentRef('config', documentPath).get().toPromise();
    const data = doc.data();
    return keys.length ? resolve(data, ...keys) : data;
  }

  set(documentPath: string, data: object) {
    return this.db.setDocument('config', documentPath, data);
  }

  async isRegistrationEnabled() {
    return true;
    // const enabled = await this.get('registration', 'enabled');
    // return enabled === false ? false : true; // logic diferent from cms, where the user will have to register to use the App
  }
}
