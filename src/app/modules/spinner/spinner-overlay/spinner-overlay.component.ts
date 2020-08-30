import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spinner-overlay',
  templateUrl: './spinner-overlay.component.html',
  styleUrls: ['./spinner-overlay.component.scss']
})
export class SpinnerOverlayComponent implements OnInit {

  @Input() public percent: number;

  constructor() { }

  ngOnInit() {
  }

}
