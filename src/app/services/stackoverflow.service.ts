import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StackoverflowService {

  constructor(private httpClient: HttpClient) { }

  getFavorites() {
    let url = "https://api.stackexchange.com/2.2/users/9113074/favorites?order=desc&sort=activity&site=stackoverflow";
    return this.httpClient.get(url)
}
}
