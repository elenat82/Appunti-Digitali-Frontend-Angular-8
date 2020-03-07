import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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

  getContentFromServer(typeOfContent) : Observable<any[]> {
    let url = `${environment.rootPath}${environment.content}${environment[typeOfContent]}`;
    return this.httpClient.get<any[]>(url);
  }

  getContentFromIndexedDB() : Observable<any> {
    return this.storageMap.get<any>('content');
  }

  writeIntoIndexedDB(key, value): Observable<any> {
    return this.storageMap.set(key, value);
  }
}
