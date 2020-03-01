import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { MenuVoice } from 'src/app/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public menuVoices : Observable<MenuVoice[]>;
  
  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.menuVoices = this.menuService.getMenu();
  }

}
