import { SpinnerOverlayService } from './services/spinner-overlay/spinner-overlay-service.service';
import { ContentAngular, ContentCss, ContentDrupal, ContentHtml, ContentJS, ContentPhp, ContentVarie } from './models';
import { Component, OnInit, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { fadeAnimation } from './animations';
import { ContentService } from './services/content.service';
import { Observable, forkJoin, Subject, BehaviorSubject } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { MatDialog, MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  
  public title = 'Appunti Digitali';
  public opened: boolean;
  public strumentiUtili;

  public query = "";
  public simplebarOptions = {
    autoHide: false
  }

  private screenWidth$ = new BehaviorSubject<number> (window.innerWidth);
  @ViewChild('sidenav', {static: false}) matSidenav: MatSidenav;

  constructor(private contentService: ContentService, private storageMap: StorageMap, public spinnerOverlayService: SpinnerOverlayService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getScreenWidth().subscribe(width => {
       if (width < 1200) {
         this.opened = false;
      }
      else if (width >= 1200) {
        this.opened = true;
      }
    });

    this.contentService.getStrumentiUtili().subscribe(
      (res) => {
        this.strumentiUtili = res[0].approfondimenti;
      },
      (err) => {
        
      })
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }
  getScreenWidth(): Observable<number> {
    return this.screenWidth$.asObservable();
  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: 'auto',
      data: { strumentiUtili: this.strumentiUtili }
  });

  dialogRef.afterClosed().subscribe(result => {
  });
  }
}
