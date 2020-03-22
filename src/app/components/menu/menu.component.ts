import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ContentHtml, ContentCss, ContentJS, ContentAngular, ContentPhp, ContentDrupal, ContentVarie } from 'src/app/models';

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
  public menuAngular : ContentAngular[];
  public menuPhp: ContentPhp[];
  public menuDrupal: ContentDrupal[];
  public menuVarie: ContentVarie[];

  
  constructor(private contentService: ContentService, private router: Router) { }

  ngOnInit() {
    this.contentService.dataSavedToLS.subscribe(
      (res) => {
        console.log('res nel menuuuuuuuuuuuuuuuuuu: ', res);
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
    )
  }

}
