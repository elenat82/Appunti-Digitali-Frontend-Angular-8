import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { forkJoin, combineLatest, pipe, empty } from 'rxjs';
import { ContentService } from './content.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentResolverService implements Resolve<any>{

  constructor(private storageMap: StorageMap, private contentService: ContentService) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot) {
    return forkJoin(
      this.contentService.getContentFromIndexedDB('html'),
      this.contentService.getContentFromIndexedDB('css'),
      this.contentService.getContentFromIndexedDB('javascript'),
      this.contentService.getContentFromIndexedDB('angular'),
      this.contentService.getContentFromIndexedDB('php'),
      this.contentService.getContentFromIndexedDB('drupal'),
      this.contentService.getContentFromIndexedDB('varie')
    ).pipe(
      catchError((error) => {
        return empty();
        })
    )
  }
}
