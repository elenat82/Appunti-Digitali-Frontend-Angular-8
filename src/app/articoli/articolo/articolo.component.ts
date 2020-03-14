import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationExtras, Params } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { ContentService } from 'src/app/services/content.service';
import { forkJoin, combineLatest, pipe } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-articolo',
  templateUrl: './articolo.component.html',
  styleUrls: ['./articolo.component.scss']
})
export class ArticoloComponent implements OnInit {

  public content: any;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private contentService: ContentService,
    private storageMap: StorageMap) {this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit() {

    this.activatedRoute.params.forEach((params: Params) => {
      this.storageMap.get(params.materia)
      .pipe(
        map( (data : any[]) => {
          return data.filter( el => {
            return el.id == params.id
          })[0]
        }),
        map( (obj: any) => {
          let frag = document.createRange().createContextualFragment(obj.body);
          let codes = frag.querySelectorAll('.code');
          console.log('codes: ', codes);
          return obj;
        })
      )
      .subscribe(
        (res : any) => {
          this.content = res;
        }
      )
    });
    
  }

  ngOnDestroy(): void {
    
  }

}
