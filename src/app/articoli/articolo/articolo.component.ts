import { Component, OnInit, AfterViewChecked, HostListener, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationExtras, Params } from '@angular/router';
import { switchMap, map, tap } from 'rxjs/operators';
import { ContentService } from 'src/app/services/content.service';
import { forkJoin, combineLatest, pipe, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { SpinnerOverlayService } from 'src/app/services/spinner-overlay/spinner-overlay-service.service';
import { HighlightService } from 'src/app/services/highlight.service';

@Component({
  selector: 'app-articolo',
  templateUrl: './articolo.component.html',
  styleUrls: ['./articolo.component.scss']
})
export class ArticoloComponent implements OnInit, AfterViewChecked, OnDestroy {

  public content: any;
  public options = {
    autoHide: false
  }
  private highlighted: boolean = false;
  private done = false;

  private materiaArticolo: string;

  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);

  public showAsideOnTheRight: boolean;

  private codepenAddedToHead = false;

  private storageSubscription: Subscription;
  private screenSubscription: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contentService: ContentService,
    public spinnerOverlayService: SpinnerOverlayService,
    private highlightService: HighlightService,
    private storageMap: StorageMap,
    private zone: NgZone) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit() {
    this.spinnerOverlayService.show();
    this.activatedRoute.params.forEach((params: Params) => {
      this.materiaArticolo = params.materia;
      this.storageSubscription = this.storageMap.get(params.materia)
        .pipe(
          map((data: any[]) => {
            if (data && data.length) {
              return data.filter(el => {
                return el.slug == params.slug
              })[0]
            }
          }),
          map((obj: any) => {
            if (obj) {
              let defaultTab = params.materia == "javascript" ? "js" : params.materia;
              let frag = document.createRange().createContextualFragment(obj.body);
              let codes = frag.querySelectorAll('.penny');
              codes.length && codes.forEach(el => {
                el.classList.add('codepen');
                if (obj.titolo == "Geolocation API") {
                  el.setAttribute('data-prefill', '{"scripts":["https://maps.googleapis.com/maps/api/js?key=&extension=.js"]}');
                }
                else {
                  el.setAttribute('data-prefill', '');
                }
                el.setAttribute('data-height', '400');
                el.setAttribute('data-theme-id', '1');
                el.setAttribute('data-default-tab', '' + defaultTab + ',result');
                el.setAttribute('data-editable', 'true');
              });
              const serializer = new XMLSerializer();
              const document_fragment_string = serializer.serializeToString(frag);
              obj.body = document_fragment_string;
            }
            return obj;
          }),
          tap((x) => {
            if (this.codepenAddedToHead == false) {
              let node = document.createElement('script');
              node.src = 'https://static.codepen.io/assets/embed/ei.js';
              node.type = 'text/javascript';
              node.async = true;
              node.charset = 'utf-8';
              document.getElementsByTagName('head')[0].appendChild(node);
              this.codepenAddedToHead = true;
            }
          }),
          map((res) => {
            if (res && res.approfondimenti) {
              res.approfondimenti.forEach(element => {
                if (element.url.includes("www.w3.org")) {
                  element.icon = "icon-app-w3c";
                }
                else if (element.url.includes("google.com")) {
                  element.icon = "icon-app-google";
                }
                else if (element.url.includes("twitter.com")) {
                  element.icon = "icon-app-twitter";
                }
                else {
                  element.icon = ""
                }
              });
            }
            return res;
          })
        )
        .subscribe(
          (res: any) => {
            this.content = res;
            this.done = true
            this.spinnerOverlayService.hide();
          },
          (err) => {
            console.log('err: ', err);
            this.spinnerOverlayService.hide();
          }
        )
    });

    this.screenSubscription = this.getScreenWidth().subscribe(width => {
      if (width < 1200) {
        this.showAsideOnTheRight = false;
      }
      else if (width >= 1200) {
        this.showAsideOnTheRight = true;
      }
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }

  ngAfterViewChecked() {
    if (!this.highlighted && this.done) {
      this.highlightService.highlightAll();
      this.highlighted = true;
    }
  }

  getScreenWidth(): Observable<number> {
    return this.screenWidth$.asObservable();
  }

  ngOnDestroy(): void {
    this.storageSubscription.unsubscribe();
    this.screenSubscription.unsubscribe();
    if (this.codepenAddedToHead) {
      let headtag = document.getElementsByTagName('head')[0];
      for (let i = 0; i < headtag.children.length; i++) {
        const el = headtag.children[i];
        if (el.nodeName == 'SCRIPT') {
          let src = el.attributes.getNamedItem("src");
          if (src.value == 'https://static.codepen.io/assets/embed/ei.js') {
            headtag.removeChild(el);
            this.codepenAddedToHead = false;
          }
        }
      }
    }
  }
}
