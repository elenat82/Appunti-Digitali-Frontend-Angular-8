import { SafePipe } from './../pipes/safe.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticoloComponent } from './articolo/articolo.component';
import { ArticoliRoutingRoutingModule } from './articoli-routing-routing.module';
import { AngularMaterialModule } from '../modules/angular-material.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { HighlightService } from '../services/highlight.service';



@NgModule({
  declarations: [ArticoloComponent, SafePipe],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ArticoliRoutingRoutingModule,
    SimplebarAngularModule
  ],
  providers: [HighlightService]
})
export class ArticoliModule { }
