import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';
import { Observable, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { ContentHtml, ContentCss, ContentJS, ContentAngular, ContentPhp, ContentDrupal, ContentVarie } from 'src/app/models';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public query = "";

  public simplebarOptions = {
    autoHide: false
  }

  public menuHtml: ContentHtml[];
  public menuCss: ContentCss[];
  public menuJS: ContentJS[];
  public menuAngular: ContentAngular[];
  public menuPhp: ContentPhp[];
  public menuDrupal: ContentDrupal[];
  public menuVarie: ContentVarie[];


  constructor(private contentService: ContentService, private router: Router, private storageMap: StorageMap) { }

  ngOnInit() {
    this.contentService.dataSavedToLS.subscribe(
      (res) => {
        this.menuHtml = res[0];
        this.menuCss = res[1];
        this.menuJS = res[2];
        this.menuAngular = res[3];
        this.menuPhp = res[4];
        this.menuDrupal = res[5];
        this.menuVarie = res[6];
      },
      (err) => {
        console.log('err: ', err);
      }
    );
    forkJoin(
      this.storageMap.get('html'),
      this.storageMap.get('css'),
      this.storageMap.get('javascript'),
      this.storageMap.get('angular'),
      this.storageMap.get('php'),
      this.storageMap.get('drupal'),
      this.storageMap.get('varie')
    )
      .pipe(

      )
      .subscribe(
        (res) => {
          if (res[0]) {
            this.menuHtml = res[0];
            this.menuCss = res[1];
            this.menuJS = res[2];
            this.menuAngular = res[3];
            this.menuPhp = res[4];
            this.menuDrupal = res[5];
            this.menuVarie = res[6];
          }

        }
      )
  }

  trackByFunc(index: number, el: any) {
    return el.id;
  }

}
