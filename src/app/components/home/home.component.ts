import { StackoverflowService } from './../../services/stackoverflow.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { map, switchMap, delay, tap } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, forkJoin, of, pipe, concat } from 'rxjs';
import { ContentService } from 'src/app/services/content.service';
import { FilterlistPipe } from 'src/app/pipes/filterlist.pipe';
import { SafePipe } from 'src/app/pipes/safe.pipe';
import { Router, NavigationExtras, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { SpinnerOverlayService } from 'src/app/services/spinner-overlay/spinner-overlay-service.service';
import { FeedsService } from 'src/app/services/feeds.service';
import * as xml2js from "xml2js";
import { SlugifyPipe } from 'src/app/pipes/slugify.pipe';

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
  public feed;
  public ultimiLettiHtml;
  public ultimiLettiCss;
  public ultimiLettiJS;
  public ultimiLettiAngular;
  public ultimiLettiPhp;
  public ultimiLettiDrupal;
  public ultimiLettiVarie;
  public questions;
  public options = {
    autoHide: false,
    scrollbarMinSize: 100
  }

  constructor(public contentService: ContentService, public filterlistPipe: FilterlistPipe, private _formBuilder: FormBuilder, private router: Router, private storageMap: StorageMap, public spinnerOverlayService: SpinnerOverlayService, private activatedRoute: ActivatedRoute, private feedService: FeedsService, private stackoverflowService: StackoverflowService, private slugifyPipe: SlugifyPipe) { }

  ngOnInit() {
    this.spinnerOverlayService.show();
    forkJoin(
      this.contentService.getContentFromServer('html'),
      this.contentService.getContentFromServer('css'),
      this.contentService.getContentFromServer('javascript'),
      this.contentService.getContentFromServer('angular'),
      this.contentService.getContentFromServer('php'),
      this.contentService.getContentFromServer('drupal'),
      this.contentService.getContentFromServer('varie'),
      this.storageMap.get("ultimiletti"),
      this.stackoverflowService.getFavorites()
    ).pipe(
      map((data: any[]) => {
        if (data.length) {
          data[0].map( d => { //html
            d.slug = this.slugifyPipe.transform(d.titolo);
          });
          data[1].map( d => { //css
            d.slug = this.slugifyPipe.transform(d.titolo);
          });
          data[2].map( d => { //js
            d.slug = this.slugifyPipe.transform(d.titolo);
          });
          data[3].map( d => { //angular
            d.slug = this.slugifyPipe.transform(d.titolo);
          });
          data[4].map( d => { //php
            d.slug = this.slugifyPipe.transform(d.titolo);
          });
          data[5].map( d => { //drupal
            d.slug = this.slugifyPipe.transform(d.titolo);
          });
          data[0].map( d => { //varie
            d.slug = this.slugifyPipe.transform(d.titolo);
          });
        }
        return data;
      })
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
            );
            if (res[7].length && res[7][0] != undefined) {
              this.ultimiLettiHtml = res[0].filter(el => {
                return res[7].includes(`${el.id}`);
              });
              this.ultimiLettiCss = res[1].filter(el => {
                return res[7].includes(`${el.id}`);
              });
              this.ultimiLettiJS = res[2].filter(el => {
                return res[7].includes(`${el.id}`);
              });
              this.ultimiLettiAngular = res[3].filter(el => {
                return res[7].includes(`${el.id}`);
              });
              this.ultimiLettiPhp = res[4].filter(el => {
                return res[7].includes(`${el.id}`);
              });
              this.ultimiLettiDrupal = res[5].filter(el => {
                return res[7].includes(`${el.id}`);
              });
              this.ultimiLettiVarie = res[6].filter(el => {
                return res[7].includes(`${el.id}`);
              });
            }
            else {
              //shuffle e prendi ultimi 3 di ognuno
              const n = 3;
              this.ultimiLettiHtml = res[0]
                .map(x => ({ x, r: Math.random() }))
                .sort((a, b) => a.r - b.r)
                .map(a => a.x)
                .slice(0, n);
              this.ultimiLettiCss = res[1]
                .map(x => ({ x, r: Math.random() }))
                .sort((a, b) => a.r - b.r)
                .map(a => a.x)
                .slice(0, n);
              this.ultimiLettiJS = res[2]
                .map(x => ({ x, r: Math.random() }))
                .sort((a, b) => a.r - b.r)
                .map(a => a.x)
                .slice(0, n);
              this.ultimiLettiAngular = res[3]
                .map(x => ({ x, r: Math.random() }))
                .sort((a, b) => a.r - b.r)
                .map(a => a.x)
                .slice(0, n);
              this.ultimiLettiPhp = res[4]
                .map(x => ({ x, r: Math.random() }))
                .sort((a, b) => a.r - b.r)
                .map(a => a.x)
                .slice(0, n);
              this.ultimiLettiDrupal = res[5]
                .map(x => ({ x, r: Math.random() }))
                .sort((a, b) => a.r - b.r)
                .map(a => a.x)
                .slice(0, n);
              this.ultimiLettiVarie = res[6]
                .map(x => ({ x, r: Math.random() }))
                .sort((a, b) => a.r - b.r)
                .map(a => a.x)
                .slice(0, n);
            }

            if(res[8]) { //preferiti di stackoverflow
              this.questions = res[8].items;
            }
          }
        },
        (err) => {
          console.log('err: ', err);
          this.spinnerOverlayService.hide();
        }
      );

    this.feedService.getFeeds().subscribe(
      (res) => {
        if (res && res.rss) {
          this.feed = res;
        }
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

  selected(ev) {
    this.router.navigate(['/appunti', ev.option.value.tipo.toLowerCase(), ev.option.value.slug]);
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
