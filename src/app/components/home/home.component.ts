import { StorageMap } from '@ngx-pwa/local-storage';
import { map, switchMap, delay } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, forkJoin, of, pipe } from 'rxjs';
import { ContentService } from 'src/app/services/content.service';
import { FilterlistPipe } from 'src/app/pipes/filterlist.pipe';
import { SafePipe } from 'src/app/pipes/safe.pipe';
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
    this.spinnerOverlayService.show();
    forkJoin(
      this.contentService.getContentFromServer('html'),
      this.contentService.getContentFromServer('css'),
      this.contentService.getContentFromServer('javascript'),
      this.contentService.getContentFromServer('angular'),
      this.contentService.getContentFromServer('php'),
      this.contentService.getContentFromServer('drupal'),
      this.contentService.getContentFromServer('varie')
    ).pipe(
      
    )
    .subscribe(
      (res) => {
        if (res) {
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
            forkJoin(
              this.contentService.writeIntoIndexedDB('html', res[0]),
              this.contentService.writeIntoIndexedDB('css', res[1]),
              this.contentService.writeIntoIndexedDB('javascript', res[2]),
              this.contentService.writeIntoIndexedDB('angular', res[3]),
              this.contentService.writeIntoIndexedDB('php', res[4]),
              this.contentService.writeIntoIndexedDB('drupal', res[5]),
              this.contentService.writeIntoIndexedDB('varie', res[6])
            ).subscribe(
              () => {
                this.contentService.dataSavedToLS.emit(res);
                this.spinnerOverlayService.hide();
              }
            )
        }
      },
      (err) => {
        console.log('err: ', err);
        this.spinnerOverlayService.hide();

      }
    )
  }


  private _filterGroup(value: string): any[] {
    if (value) {
      return this.materieGroups
        .map(group => ({ materia: group.materia, articoli: this.filterlistPipe.transform(group.articoli, value) }))
        .filter(group => group.articoli.length > 0);
    }

    return this.materieGroups;
  }

  selected(ev) {
    this.router.navigate(['/content', ev.option.value.tipo.toLowerCase(), ev.option.value.id]);
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
