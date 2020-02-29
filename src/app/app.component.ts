import { Component } from '@angular/core';
import { fadeAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent {
  title = 'Appunti Digitali';

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
