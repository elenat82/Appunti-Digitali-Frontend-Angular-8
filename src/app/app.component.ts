import { SpinnerOverlayService } from './services/spinner-overlay/spinner-overlay-service.service';
import { ContentAngular, ContentCss, ContentDrupal, ContentHtml, ContentJS, ContentPhp, ContentVarie } from './models';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  public contentHtml: ContentHtml;
  public contentCss: ContentCss;
  public contentJS: ContentJS;
  public contentAngular : ContentAngular;
  public contentPhp: ContentPhp;
  public contentDrupal: ContentDrupal;
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
            this.contentService.getContentFromServer('html'),
            this.contentService.getContentFromServer('css'),
            this.contentService.getContentFromServer('js'),
            this.contentService.getContentFromServer('angular'),
            this.contentService.getContentFromServer('php'),
            this.contentService.getContentFromServer('drupal'),
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
    this.contentHtml = data[0];
    this.contentCss = data[1];
    this.contentJS = data[2];
    this.contentAngular = data[3];
    this.contentPhp = data[4];
    this.contentDrupal = data[5];
    this.contentVarie = data[6];
    this.menuVoices = {
      html: this.contentHtml,
      css: this.contentCss,
      js: this.contentJS,
      angular: this.contentAngular,
      php: this.contentPhp,
      drupal: this.contentDrupal,
      varie: this.contentVarie
    }
    this.contentService.notify.emit(this.menuVoices);
  }

  ngOnDestroy(): void {
    
  }


  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
