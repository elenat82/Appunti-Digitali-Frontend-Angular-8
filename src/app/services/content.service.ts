import { FeedsService } from 'src/app/services/feeds.service';
import { StackoverflowService } from './stackoverflow.service';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, defer, forkJoin, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageMap, JSONSchema, JSONSchemaObject, JSONSchemaArray } from '@ngx-pwa/local-storage';
import { ContentHtml, ContentCss, ContentJS, ContentAngular, ContentPhp, ContentDrupal, ContentVarie } from '../models';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { finalize, tap, catchError } from 'rxjs/operators';

function forkJoinWithProgress(arrayOfObservables) {
  return defer(() => { // here we go
    let counter = 0;
    const percent$ = new Subject();
    const modilefiedObservablesList = arrayOfObservables.map(
      (item, index) => item.pipe(
        finalize(() => {
          const percentValue = ++counter * 100 / arrayOfObservables.length;
          percent$.next(percentValue);
        }),
        catchError(e => {return of([])})
      )
    );
    const finalResult$ = forkJoin(modilefiedObservablesList).pipe(
      tap(() => {
        percent$.next(100);
        percent$.complete();
      })
    );
    return of([finalResult$, percent$.asObservable()]);
  })

}

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  @Output() dataSavedToLS = new EventEmitter();

  private httpOption = {
    headers: new HttpHeaders(
      { 'Content-type': 'application/json' }
    )
  };

  public shortScreen = false;
  public nrOfColumns = 1;
  public hideBottomToolbar = false;

  constructor(private httpClient: HttpClient, private storageMap: StorageMap, private router: Router, private stackoverflowService: StackoverflowService, private feedService: FeedsService) {


  }

  getContentFromServer(typeOfContent: string): Observable<ContentHtml[] | ContentCss[] | ContentJS[] | ContentAngular[] | ContentPhp[] | ContentDrupal[] | ContentVarie[]> {
    let url = `${environment.rootPath}${environment.content}${environment[typeOfContent]}`;
    return this.httpClient.get<any[]>(url);
  }

  getContentWithPercent(arrayOfUrls) {
    const arrayOfObservables = arrayOfUrls.map((singleUrl, index) => {
      let url = `${environment.rootPath}${environment.content}${environment[singleUrl]}`;
      return this.httpClient.get<any[]>(url)
    }
    )

    arrayOfObservables.push(this.stackoverflowService.getStarred(),
    this.stackoverflowService.getFavorites(),
    this.feedService.getFeeds()); 

    return forkJoinWithProgress(arrayOfObservables)
  }

getContentFromIndexedDB(key: string): Observable < any > {
  return this.storageMap.get<any>(key);
}

writeIntoIndexedDB(key: string, value: ContentHtml | ContentCss | ContentJS | ContentAngular | ContentPhp | ContentDrupal | ContentVarie): Observable < any > {
  return this.storageMap.set(key, value);
}

getStrumentiUtili(): Observable < any > {
  let url = `${environment.rootPath}${environment.content}${environment.strumentiUtili}`;
  return this.httpClient.get<any[]>(url);
}

}
