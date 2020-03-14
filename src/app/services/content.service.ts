import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageMap, JSONSchema, JSONSchemaObject, JSONSchemaArray } from '@ngx-pwa/local-storage';
import { ContentHtml, ContentCss, ContentJS, ContentAngular, ContentPhp, ContentDrupal, ContentVarie } from '../models';

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

  constructor(private httpClient: HttpClient, private storageMap: StorageMap) { }

  getContentFromServer(typeOfContent: string): Observable<ContentHtml[] | ContentCss[] | ContentJS[] | ContentAngular[] | ContentPhp[] | ContentDrupal[] | ContentVarie[]> {
    let url = `${environment.rootPath}${environment.content}${environment[typeOfContent]}`;
    return this.httpClient.get<any[]>(url);
  }

  getContentFromIndexedDB(key: string):  Observable<any>  {
    return this.storageMap.get<any>(key);
  }

  writeIntoIndexedDB(key: string, value: ContentHtml | ContentCss | ContentJS | ContentAngular | ContentPhp | ContentDrupal | ContentVarie): Observable<any> {
    return this.storageMap.set(key, value);
  }
}
