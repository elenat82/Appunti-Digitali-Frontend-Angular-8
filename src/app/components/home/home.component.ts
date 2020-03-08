import { map } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ContentService } from 'src/app/services/content.service';
import { FilterlistPipe } from 'src/app/pipes/filterlist.pipe';
import { Router } from '@angular/router';

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

  constructor(private contentService: ContentService, public filterlistPipe: FilterlistPipe, private _formBuilder: FormBuilder, private router: Router,) { }

  ngOnInit() {
    this.contentService.notify.subscribe(
      (res) => {
        this.materieGroups = [
          {
            materia: "Html",
            articoli: res.html
          },
          {
            materia: "Css",
            articoli: res.css
          },
          {
            materia: "JavaScript",
            articoli: res.js
          },
          {
            materia: "Angular",
            articoli: res.angular
          },
          {
            materia: "Php",
            articoli: res.php
          }, {
            materia: "Drupal",
            articoli: res.drupal
          },
          {
            materia: "Varie",
            articoli: res.varie
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
    ////////PASSARE TUTTO L'ARTICOLO AL COMPONENT (tutto ev.option.value)
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
