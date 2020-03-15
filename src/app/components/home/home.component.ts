import { StorageMap } from '@ngx-pwa/local-storage';
import { map, switchMap, delay } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, forkJoin, of, pipe } from 'rxjs';
import { ContentService } from 'src/app/services/content.service';
import { FilterlistPipe } from 'src/app/pipes/filterlist.pipe';
import { Router, NavigationExtras, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { SpinnerOverlayService } from 'src/app/services/spinner-overlay/spinner-overlay-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public contentForm: FormGroup = this._formBuilder.group({
    query: '',
  });
  public materieGroups: any[];
  public materieOptions: Observable<any[]>;

  constructor(private contentService: ContentService, public filterlistPipe: FilterlistPipe, private _formBuilder: FormBuilder, private router: Router, private storageMap: StorageMap, public spinnerOverlayService: SpinnerOverlayService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    //cerco i dati nell'indexeddb
    forkJoin(
      this.contentService.getContentFromIndexedDB('html'),
      this.contentService.getContentFromIndexedDB('css'),
      this.contentService.getContentFromIndexedDB('javascript'),
      this.contentService.getContentFromIndexedDB('angular'),
      this.contentService.getContentFromIndexedDB('php'),
      this.contentService.getContentFromIndexedDB('drupal'),
      this.contentService.getContentFromIndexedDB('varie')
    ).pipe(
      
    )
    .subscribe(
      (res) => {
        console.log('resaaaaaaaaaaaaaa: ', res);
        if (res[0] != undefined) {
          this.materieGroups = [
            {
              materia: "Html",
              articoli: res[0]
            },
            {
              materia: "Css",
              articoli: res[1]
            },
            {
              materia: "JavaScript",
              articoli: res[2]
            },
            {
              materia: "Angular",
              articoli: res[3]
            },
            {
              materia: "Php",
              articoli: res[4]
            }, {
              materia: "Drupal",
              articoli: res[5]
            },
            {
              materia: "Varie",
              articoli: res[6]
            }
          ];
          this.materieOptions = this.contentForm.get('query')!.valueChanges
            .pipe(
              //startWith(''),
              map(value => (value && value.length >= 3) ? this._filterGroup(value) : null)
            );
        }
      },
      (err) => {
        console.log('err: ', err);

      }
    )
    this.contentService.dataSavedToLS.subscribe(
      (res) => {
        console.log('resbbbbbbbbbbbbbbbbbbbbb: ', res);
        this.materieGroups = [
          {
            materia: "Html",
            articoli: res[0]
          },
          {
            materia: "Css",
            articoli: res[1]
          },
          {
            materia: "JavaScript",
            articoli: res[2]
          },
          {
            materia: "Angular",
            articoli: res[3]
          },
          {
            materia: "Php",
            articoli: res[4]
          }, {
            materia: "Drupal",
            articoli: res[5]
          },
          {
            materia: "Varie",
            articoli: res[6]
          }
        ];
        this.materieOptions = this.contentForm.get('query')!.valueChanges
          .pipe(
            //startWith(''),
            map(value => (value && value.length >= 3) ? this._filterGroup(value) : null)
          );
      },
      (err) => {
        console.log('err: ', err);
      }
    );
  }


  private _filterGroup(value: string): any[] {
    if (value) {
      return this.materieGroups
        .map(group => ({ materia: group.materia, articoli: this.filterlistPipe.transform(group.articoli, value) }))
        .filter(group => group.articoli.length > 0);
    }

    return this.materieGroups;
  }


  getOptionText(option) {
    if (option) {
      return option.titolo;
    }
    else {
      return ''
    }

  }


}
