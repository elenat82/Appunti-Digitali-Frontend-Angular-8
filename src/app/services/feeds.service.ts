import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { empty, of } from 'rxjs';
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
    let url = `${environment.rootPath}${environment.rssfeed}ddddddddd`;
    return this.httpClient.get(url, this.requestOptions)
    .pipe(
      map( res => {
        let parsedFeed;
        let parseString = xml2js.parseString;
        parseString(res, (err, result: any) => {
          parsedFeed = result;
        });
        return parsedFeed;
      }),
      map(
        (res) => {
          res.rss.channel[0].item.reverse();
          return res;
        }
      ),
      catchError((error) => {
        console.log('error: ', error);
        return of([]);
        })
    )
}

}
