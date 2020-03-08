import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticoloComponent } from './articolo/articolo.component';
import { ArticoliRoutingRoutingModule } from './articoli-routing-routing.module';
import { AngularMaterialModule } from '../modules/angular-material.module';



@NgModule({
  declarations: [ArticoloComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ArticoliRoutingRoutingModule
  ]/* ,
  exports: [ArticoloComponent] */
})
export class ArticoliModule { }
