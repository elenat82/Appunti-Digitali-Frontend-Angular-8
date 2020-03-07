import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() menuVoices : any;

  public query = "";
  
  constructor(private contentService: ContentService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes: ', changes);
  }

}
