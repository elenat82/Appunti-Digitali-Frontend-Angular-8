import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from './animations';
import { ContentService } from './services/content.service';
import { Observable } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  
  public title = 'Appunti Digitali';

  public menuVoices : Observable<any[]>;

  constructor(private contentService: ContentService, private storageMap: StorageMap) { }

  ngOnInit() {
    this.contentService.getContentFromIndexedDB().subscribe(
      (res) => {
        console.log('dati dalla getContentFromIndexedDB ', res);
        if (res) {
          this.menuVoices = res;
        }
        else {
          this.contentService.getContentFromServer().subscribe(
            (res) => {
              console.log('dati datta getContentFromServer: ', res);
              if (res) {
                this.contentService.writeIntoIndexedDB('content', res).subscribe(
                  (res) => {
                  },
                  (err) => {
                    console.log('errore nella writeIntoIndexedDB: ', err);

                  }
                );
              }
            },
            (err) => {
              console.log('errore nella getContentFromServer: ', err);
            }
          );
        }

      },
      (err) => {
        console.log('errore nella getContentFromIndexedDB: ', err);
      }
    );
  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
