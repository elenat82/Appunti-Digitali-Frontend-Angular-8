import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { empty } from 'rxjs';
import * as xml2js from "xml2js";
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FeedsService {

  constructor(private httpClient: HttpClient) { }

  private requestOptions: Object = {
    observe: "body",
    responseType: "text"
  };

  

  getFeeds() {
    //fare su drupal una vista e chiamare l'url da qui
    let url = `${environment.rootPath}${environment.rssfeed}`;
    return this.httpClient.get(url, this.requestOptions)
    .pipe(
      map( res => {
        let parsedFeed;
        let parseString = xml2js.parseString;
        parseString(res, (err, result: any) => {
          parsedFeed = result;
        });
        return parsedFeed
      }),
      catchError((error) => {
        console.log('error: ', error);
        return empty();
        })
    )
}

}
