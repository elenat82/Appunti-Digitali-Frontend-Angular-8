import { SpinnerOverlayService } from './services/spinner-overlay/spinner-overlay-service.service';
import { ContentAngular, ContentCss, ContentDrupal, ContentHtml, ContentJS, ContentPhp, ContentVarie } from './models';
import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from './animations';
import { ContentService } from './services/content.service';
import { Observable, forkJoin, Subject } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  
  public title = 'Appunti Digitali';

  public menuVoices : any;
  public contentAngular : ContentAngular;
  public contentCss: ContentCss;
  public contentDrupal: ContentDrupal;
  public contentHtml: ContentHtml;
  public contentJS: ContentJS;
  public contentPhp: ContentPhp;
  public contentVarie: ContentVarie;

  constructor(private contentService: ContentService, private storageMap: StorageMap, public spinnerOverlayService: SpinnerOverlayService) { }

  ngOnInit() {
    this.spinnerOverlayService.show();
    this.contentService.getContentFromIndexedDB().subscribe(
      (res) => {
        if (res) {
          this.setUpData(res);
          this.spinnerOverlayService.hide();
        }
        else {
          forkJoin(
            this.contentService.getContentFromServer('angular'),
            this.contentService.getContentFromServer('css'),
            this.contentService.getContentFromServer('drupal'),
            this.contentService.getContentFromServer('html'),
            this.contentService.getContentFromServer('js'),
            this.contentService.getContentFromServer('php'),
            this.contentService.getContentFromServer('varie')
          ).pipe(
            
          ).subscribe(
            (response) => {
              if (response) {
                this.setUpData(response);
                this.contentService.writeIntoIndexedDB('content', response).subscribe(
                  (res) => {
                    console.log('res della scrittura nel db: ', res);
                    this.spinnerOverlayService.hide();
                  },
                  (err) => {
                    console.log('errore nella writeIntoIndexedDB: ', err);
                    this.spinnerOverlayService.hide();
                  }
                );
              }
            },
            (err) => {
              console.log('errore nella fork join: ', err);
              this.spinnerOverlayService.hide();
            }
          );
        }
      },
      (err) => {
        console.log('errore nella getContentFromIndexedDB: ', err);
        this.spinnerOverlayService.hide();
      }
    );
  }

  setUpData(data) {
    this.contentAngular = data[0];
    this.contentCss = data[1];
    this.contentDrupal = data[2];
    this.contentHtml = data[3];
    this.contentJS = data[4];
    this.contentPhp = data[5];
    this.contentVarie = data[6];
    this.menuVoices = {
      angular: this.contentAngular,
      css: this.contentCss,
      drupal: this.contentDrupal,
      html: this.contentHtml,
      js: this.contentJS,
      php: this.contentPhp,
      varie: this.contentVarie
    }
  }

  ngOnDestroy(): void {
    //fare unsubscribe
  }


  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
