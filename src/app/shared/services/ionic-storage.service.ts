import { Injectable, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IonicStorageService {

    constructor(
        private storage: Storage
    ) { }
    async getTokenFromPromise(key): Promise<any> {
        return await this.storage.ready().then(() => {
            return this.storage.get(key).then(
                (data) => {
                    return data;
                },
                (error) => console.error(error));
        });
    }
    getTokenAsObservable(key): Observable<any> {
        return from(this.getTokenFromPromise(key));
    }
}
