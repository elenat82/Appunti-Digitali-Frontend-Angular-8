import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MenuVoice } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private httpOption = {
    headers: new HttpHeaders(
      { 'Content-type': 'application/json' }
    )
  };

  constructor(private httpClient: HttpClient) { }

  getMenu() : Observable<MenuVoice[]> {
    return this.httpClient.get<MenuVoice[]>(environment.rootPath + environment.menu);
  }
}
