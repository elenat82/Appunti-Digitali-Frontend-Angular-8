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
    //cerco i dati nell'indexed db
    forkJoin(
      this.contentService.getContentFromIndexedDB('html'),
      this.contentService.getContentFromIndexedDB('css'),
      this.contentService.getContentFromIndexedDB('js'),
      this.contentService.getContentFromIndexedDB('angular'),
      this.contentService.getContentFromIndexedDB('php'),
      this.contentService.getContentFromIndexedDB('drupal'),
      this.contentService.getContentFromIndexedDB('varie')
    ).pipe(
      
    ).subscribe(
      (response) => {
        //se li trovo
        if (response[0]) {
          //non scrivo nulla nell'indexed db
          this.setUpData(response, false);
        }
        //se non li trovo li prendo dal server
        else {
          forkJoin(
            this.contentService.getContentFromServer('html'),
            this.contentService.getContentFromServer('css'),
            this.contentService.getContentFromServer('javascript'),
            this.contentService.getContentFromServer('angular'),
            this.contentService.getContentFromServer('php'),
            this.contentService.getContentFromServer('drupal'),
            this.contentService.getContentFromServer('varie')
          ).pipe(
            
          ).subscribe(
            (res) => {
              if (res) {
                //e scrivo nell'indexeddb
                this.setUpData(res, true);
              }
            },
            (err) => {
              console.log('errore nella fork join: ', err);
            }
          );
        }
      },
      (err) => {
        console.log('errore nella fork join: ', err);
      }
    );
  }

  setUpData(data: any, write: boolean) {
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
    };

    if (write) {
      forkJoin(
        this.contentService.writeIntoIndexedDB('html', this.contentHtml),
        this.contentService.writeIntoIndexedDB('css', this.contentCss),
        this.contentService.writeIntoIndexedDB('javascript', this.contentJS),
        this.contentService.writeIntoIndexedDB('angular', this.contentAngular),
        this.contentService.writeIntoIndexedDB('php', this.contentPhp),
        this.contentService.writeIntoIndexedDB('drupal', this.contentDrupal),
        this.contentService.writeIntoIndexedDB('varie', this.contentVarie)
      ).subscribe(
        () => {
          this.contentService.dataSavedToLS.emit(data);
        }
      )
    }

  }

  refreshContent() {
    this.storageMap.clear().subscribe(
      () => {
        forkJoin(
          this.contentService.getContentFromServer('html'),
          this.contentService.getContentFromServer('css'),
          this.contentService.getContentFromServer('javascript'),
          this.contentService.getContentFromServer('angular'),
          this.contentService.getContentFromServer('php'),
          this.contentService.getContentFromServer('drupal'),
          this.contentService.getContentFromServer('varie')
        ).pipe(
          
        ).subscribe(
          (res) => {
            if (res) {
              //e scrivo nell'indexeddb
              this.setUpData(res, true);
            }
          },
          (err) => {
            console.log('errore nella fork join: ', err);
          }
        );
      });
  }

  ngOnDestroy(): void {
    
  }


  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
