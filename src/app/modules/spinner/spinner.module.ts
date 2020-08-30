import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerOverlayComponent } from './spinner-overlay/spinner-overlay.component';
import { SpinnerOverlayService } from '../../services/spinner-overlay/spinner-overlay-service.service';
import { MatProgressBarModule } from '@angular/material';



@NgModule({
  declarations: [
    SpinnerOverlayComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    MatProgressBarModule
  ],
  exports: [
    SpinnerComponent,
    SpinnerOverlayComponent
  ],
  providers: [
    SpinnerOverlayService
  ],
  entryComponents: [SpinnerOverlayComponent]
})
export class SpinnerModule { }
