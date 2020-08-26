import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticoloGuard implements CanActivate {

  constructor(private storageMap: StorageMap, private router: Router, private zone: NgZone) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.storageMap.has('html')
      .pipe(
        take(1),
        map( (isVerified: boolean) => {
          if (!isVerified) {
            this.router.navigate(['/home'], {skipLocationChange: true, queryParams: {returnUrl: state.url}});
            return false;
          }
          return true;
        })
      )
  }

}
