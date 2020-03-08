import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ContentService } from 'src/app/services/content.service';
import { forkJoin, combineLatest } from 'rxjs';

@Component({
  selector: 'app-articolo',
  templateUrl: './articolo.component.html',
  styleUrls: ['./articolo.component.scss']
})
export class ArticoloComponent implements OnInit {

  public content: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private contentService: ContentService) {this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit() {
    combineLatest(
      this.contentService.notify,
      this.activatedRoute.paramMap
    ).subscribe(
      (res : any) => {
        console.log('res: ', res);
        let materia = res[1].params.materia;
        let id = parseInt(res[1].params.id, 10);
        this.content = res[0][materia].filter( el => {
          return el.id == id;
        })[0];
        
      },
      (err) => {
        console.log('err: ', err);
      }
    );

  }

  ngOnDestroy(): void {
    
  }

}
