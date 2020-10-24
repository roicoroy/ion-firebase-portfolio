import { Injectable } from "@angular/core";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private rootPath: string = null;

  constructor(
    public router: Router
  ) {
    // console.log(this.router.config[1].path);
    this.rootPath = this.router.config[1].path;
  }

  private getQueryParams(path: any) {
    const queryParams = path.split('?')[1] || '';
    const params = queryParams.length ? queryParams.split('&') : [];
    let pair = null;
    let data = {};
    params.forEach((d) => {
      pair = d.split('=');
      data[`${pair[0]}`] = pair[1];
    });
    return data;
  }

  redirectTo(...path: any[]) {
    // console.log(path, this.getQueryParams(path[0]));
    this.router.navigate(this.getRouterLink(...path), { queryParams: this.getQueryParams(path[0]) });
  }

  getRouterLink(...path: any[]) {
    // const root = this.rootPath ? '/' + this.rootPath : [];
    path = path.map((segment: string) => {
      // console.log('segment::::  ', segment);
      segment.split('?')[0];
    }); // clean up / remove query params
    // console.log('path::::  ', path);
    return path;
  }

  setRootPath(path: string) {
    this.rootPath = path;
  }

}
