import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() menuVoices : any;

  public query = "";
  
  constructor(private contentService: ContentService, private router: Router) { }

  ngOnInit() {
  }
  
  ngOnChanges(changes: SimpleChanges) {
    //console.log('changes: ', changes);
  }

}
