import { SpinnerOverlayService } from './services/spinner-overlay/spinner-overlay-service.service';
import { ContentAngular, ContentCss, ContentDrupal, ContentHtml, ContentJS, ContentPhp, ContentVarie } from './models';
import { Component, OnInit, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { fadeAnimation, animateText } from './animations';
import { ContentService } from './services/content.service';
import { Observable, forkJoin, Subject, BehaviorSubject, interval } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { MatDialog, MatSidenav, MatSnackBar } from '@angular/material';
import 'autotrack/lib/plugins/clean-url-tracker';
import 'autotrack/lib/plugins/outbound-link-tracker';
import 'autotrack/lib/plugins/page-visibility-tracker';
import 'autotrack/lib/plugins/url-change-tracker';
import { takeUntil } from 'rxjs/operators';
import { AnimationEvent } from '@angular/animations';


/* (<any>window).ga('create', 'UA-64373138-1', 'auto');
(<any>window).ga('require', 'cleanUrlTracker');
(<any>window).ga('require', 'outboundLinkTracker', {
  events: ['click', 'auxclick', 'contextmenu']
});
(<any>window).ga('require', 'pageVisibilityTracker', {
  sendInitialPageview: true,
  timeZone: 'Europe/Rome'
});
(<any>window).ga('require', 'urlChangeTracker'); */
//(<any>window).ga('send', 'pageview'); non serve perchè è già compreso nel pageVisibilityTracker

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation, animateText]

})
export class AppComponent implements OnInit {

  public title = 'Appunti Digitali';
  public opened: boolean;
  public strumentiUtili;

  public greeting: string;
  public greetingList: Array<string> = ['Benvenuto!', 'Welcome!', 'Bienvenue!', '¡Bienvenido!', 'Willkommen!', 'Bem vindo!', 'Bine ai venit!'];
  public ngUnsubscribe: Subject<any> = new Subject();
  // Start with hidden state and then change it to visible state 
  // to animate the text when the component is rendered
  public currentState = 'hidden';

  public query = "";
  public simplebarOptions = {
    autoHide: false
  }

  public currentYear = new Date().getFullYear();

  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  private screenHeight$ = new BehaviorSubject<number>(window.innerHeight);
  @ViewChild('sidenav', { static: false }) matSidenav: MatSidenav;

  constructor(public contentService: ContentService, private storageMap: StorageMap, public spinnerOverlayService: SpinnerOverlayService, public dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log(
      "%cQualcosa non va? Fammelo sapere!",
      "padding:9px 10px; " +
      "color: #284283; " +
      "background-color: #66cdaa; " +
      "line-height: 25px;");
    console.log(
      "%cScrivimi a: e.trudini82@gmail.com",
      "padding:9px 10px; " +
      "color: #284283; " +
      "background-color: #ffdab9; " +
      "line-height: 25px;");

    this.getScreenWidth().subscribe(width => {
      if (width < 1200) {
        this.opened = false;
        if (width < 1000) {
          this.contentService.nrOfColumns = 3;
        }
        else {
          this.contentService.nrOfColumns = 1;
        }
      }
      else if (width >= 1200) {
        this.opened = true;
        this.contentService.nrOfColumns = 1;
      }
    });

    this.getScreenHeight().subscribe(height => {
      if (height < 1000) {
        this.contentService.shortScreen = true;
        this.contentService.hideBottomToolbar = false;
        if (height < 565) {
          this.contentService.hideBottomToolbar = true;
          if (height < 411) {
            //fare qualcosa per migliorare la visualizzazione
          }
          else {
          }
        }
      }
      else {
        this.contentService.shortScreen = false;
        this.contentService.hideBottomToolbar = false;
      }

    })

    this.contentService.getStrumentiUtili().subscribe(
      (res) => {
        this.strumentiUtili = res[0].approfondimenti;
      },
      (err) => {

      })
  }

  //https://stackblitz.com/edit/stackoverflow-51222243?file=src%2Fapp%2Fapp.component.ts
  ngAfterViewInit() {
    this.currentState = 'hidden';
    this.greeting = this.greetingList[0];

    interval(1000)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.currentState = 'hidden';
      });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
    this.screenHeight$.next(event.target.innerHeight);
  }
  getScreenWidth(): Observable<number> {
    return this.screenWidth$.asObservable();
  }
  getScreenHeight(): Observable<number> {
    return this.screenHeight$.asObservable();
  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  openModalStrumenti(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '500px',
      height: '600px',
      maxHeight: 'none',
      data: { strumentiUtili: this.strumentiUtili }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openModalProfilo(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '600px',
      height: '600px',
      maxHeight: 'none',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  trackByFunc(index: number, el: any) {
    return el.url;
  }

  copy() {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = "e.trudini82@gmail.com";
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackBar.open("Copiato!", null, {
      duration: 2000,
      panelClass: ['blue-snackbar']
    })
  }

  toggleMenu() {
    this.matSidenav.toggle();
    if (this.matSidenav.opened) {
      var audioOpen = new Audio("assets/sounds/plunger-immediate.mp3");
      audioOpen.oncanplaythrough = function (ev) {
        if (audioOpen.canPlayType('audio/mpeg')) {
          audioOpen.play();
        }
      }
    }
    else {
      var audioClose = new Audio("assets/sounds/menu-open.mp3");
      audioClose.oncanplaythrough = function (ev) {
        if (audioClose.canPlayType('audio/mpeg')) {
          audioClose.play();
        }
      }
    }
  }

  //https://stackoverflow.com/questions/60482512/how-to-animate-the-change-of-a-variable-in-angular8-that-is-not-a-list
  animationFinished(event: AnimationEvent) {
    if (event && event.fromState === 'void' && event.toState === 'hidden') {
      this.currentState = 'visible';
    } else if (event && event.fromState === 'visible' && event.toState === 'hidden') {
      const greetingIndex = this.greetingList.findIndex((greeting: string) => greeting === this.greeting);
      const nextgreeting = this.greetingList[greetingIndex + 1];
      this.greeting = nextgreeting ? nextgreeting : this.greetingList[0];
      this.currentState = 'visible';
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
