import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Content } from '../models';
import { StorageMap, JSONSchema, JSONSchemaObject, JSONSchemaArray } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private httpOption = {
    headers: new HttpHeaders(
      { 'Content-type': 'application/json' }
    )
  };

  constructor(private httpClient: HttpClient, private storageMap: StorageMap) { }

  getContentFromServer() : Observable<any[]> {
    return this.httpClient.get<any[]>(environment.rootPath + environment.content);
  }

  getContentFromIndexedDB() : Observable<any> {
    return this.storageMap.get<Content>('content');
  }

  writeIntoIndexedDB(key, value): Observable<any> {
    return this.storageMap.set(key, value);
  }
}
