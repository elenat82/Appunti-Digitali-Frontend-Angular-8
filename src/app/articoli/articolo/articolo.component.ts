import { Component, OnInit, AfterViewChecked, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationExtras, Params } from '@angular/router';
import { switchMap, map, tap, flatMap } from 'rxjs/operators';
import { ContentService } from 'src/app/services/content.service';
import { forkJoin, combineLatest, pipe, BehaviorSubject, Observable, of } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { SpinnerOverlayService } from 'src/app/services/spinner-overlay/spinner-overlay-service.service';
import { HighlightService } from 'src/app/services/highlight.service';
import { Title } from '@angular/platform-browser';

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
  private slugArticolo: string;

  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);

  public showAsideOnTheRight: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contentService: ContentService,
    public spinnerOverlayService: SpinnerOverlayService,
    private highlightService: HighlightService,
    private storageMap: StorageMap,
    private titleService: Title) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.spinnerOverlayService.show();

    this.activatedRoute.params
        .pipe(
          switchMap( (params: any) => {
            this.materiaArticolo = params.materia;
            this.slugArticolo = params.slug;
            return this.storageMap.get(this.materiaArticolo)
          }),
          map((data: any[]) => {
            if (data && data.length) {
              return data.filter(el => {
                return el.slug == this.slugArticolo;
              })[0]
            }
          }),
          map((obj: any) => {
            if (obj) {
              let defaultTab = this.materiaArticolo == "javascript" ? "js" : this.materiaArticolo;
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
          }),
          tap((el) => {
            if (el) {
              this.titleService.setTitle("Appunti Digitali | " + el.tipo + " - " + el.titolo);
            }
          })
        )
        .subscribe(
          (res: any) => {
            this.content = res;
            setTimeout(() => {
              (<any>window).__CPEmbed();
              this.done = true;
              this.spinnerOverlayService.hide();
            }, 0);
          },
          (err) => {
            console.log('err: ', err);
            this.spinnerOverlayService.hide();
          }
        )

    this.getScreenWidth().subscribe(width => {
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
  }
}
