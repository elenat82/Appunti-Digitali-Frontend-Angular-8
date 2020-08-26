import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StackoverflowService {

  constructor(private httpClient: HttpClient) { }

  private httpOption = {
    headers: new HttpHeaders(
      { 'authorization': 'token 314b978f9df54d3e1b65b27ec68a211a672cbd69' }
    )
  };

  getFavorites() {
    let url = "https://api.stackexchange.com/2.2/users/9113074/favorites?order=desc&sort=activity&site=stackoverflow&key=REMOVED_STACKOVERFLOW_KEY";
    return this.httpClient.get(url);
  }

  getStarred() {
    let url = "https://api.github.com/users/elenat82/starred?per_page=500&sort=created";
    return this.httpClient.get(url, this.httpOption);
  }
}
