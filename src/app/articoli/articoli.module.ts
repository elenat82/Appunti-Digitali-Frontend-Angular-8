import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticoloComponent } from './articolo/articolo.component';
import { ArticoliRoutingRoutingModule } from './articoli-routing-routing.module';



@NgModule({
  declarations: [ArticoloComponent],
  imports: [
    CommonModule,
    ArticoliRoutingRoutingModule
  ]/* ,
  exports: [ArticoloComponent] */
})
export class ArticoliModule { }
