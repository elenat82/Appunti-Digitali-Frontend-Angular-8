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
      { 'authorization': 'token REMOVED_GITHUB_TOKEN' }
    )
  };

  getFavorites() {
    let url = "https://api.stackexchange.com/2.3/users/9113074/favorites?order=desc&sort=activity&site=stackoverflow&key=REMOVED_STACKOVERFLOW_KEY";
    //https://meta.stackexchange.com/questions/382991/api-request-for-favorites-now-returning-an-empty-list-is-there-a-way-to-get
    //ora i favorites sono privati e non si può più
    return this.httpClient.get(url);
  }

  getStarred() {
    let url = "https://api.github.com/users/elenat82/starred?per_page=500&sort=created";
    return this.httpClient.get(url, this.httpOption);
  }
}
