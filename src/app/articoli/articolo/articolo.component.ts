import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-articolo',
  templateUrl: './articolo.component.html',
  styleUrls: ['./articolo.component.scss']
})
export class ArticoloComponent implements OnInit {

  public content: any;

  constructor(private activatedRoute: ActivatedRoute) {console.log("qqqqqqqqqqqqqqqqqqqq") }

  ngOnInit() {
    console.log('this.activatedRoute: ', this.activatedRoute);
  }

}
