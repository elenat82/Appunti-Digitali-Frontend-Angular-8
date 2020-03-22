import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationExtras, Params } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { ContentService } from 'src/app/services/content.service';
import { forkJoin, combineLatest, pipe } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { SpinnerOverlayService } from 'src/app/services/spinner-overlay/spinner-overlay-service.service';
import { HighlightService } from 'src/app/services/highlight.service';

@Component({
  selector: 'app-articolo',
  templateUrl: './articolo.component.html',
  styleUrls: ['./articolo.component.scss']
})
export class ArticoloComponent implements OnInit, AfterViewChecked {

  public content: any;
  public options = {
    autoHide: false
  }
  private highlighted: boolean = false;
  private done = false;

  private materiaArticolo: string ; 

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private contentService: ContentService,
    public spinnerOverlayService: SpinnerOverlayService,
    private highlightService: HighlightService,
    private storageMap: StorageMap) {this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit() {
    this.spinnerOverlayService.show();
    this.activatedRoute.params.forEach((params: Params) => {
      this.materiaArticolo = params.materia;
      this.storageMap.get(params.materia)
      .pipe(
        map( (data : any[]) => {
          return data.filter( el => {
            return el.id == params.id
          })[0]
        }),
        map( (obj: any) => {
          let frag = document.createRange().createContextualFragment(obj.body);
          let codes = frag.querySelectorAll('.penny');
          codes.forEach( el => {
            el.classList.add('codepen');
            el.setAttribute('data-prefill', '');
            el.setAttribute('data-height', '400');
            el.setAttribute('data-theme-id', '1');
            el.setAttribute('data-default-tab', 'html,result');
          })
          const serializer = new XMLSerializer();
          const document_fragment_string = serializer.serializeToString(frag);
          obj.body = document_fragment_string;
          let node = document.createElement('script');
          node.src = 'https://static.codepen.io/assets/embed/ei.js';
          node.type = 'text/javascript';
          node.async = true;
          node.charset = 'utf-8';
          document.getElementsByTagName('head')[0].appendChild(node);
          return obj;
        })
      )
      .subscribe(
        (res : any) => {
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
    
  }

  ngAfterViewChecked() {
    if (!this.highlighted && this.done && this.materiaArticolo == "php" ) {
      this.highlightService.highlightAll();
      this.highlighted = true;
    }
  }

  ngOnDestroy(): void {
    
  }

}
