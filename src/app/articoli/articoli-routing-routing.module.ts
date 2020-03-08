import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticoloComponent } from './articolo/articolo.component';


const routes: Routes = [
  {
    path: ':materia/:id',
    component: ArticoloComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticoliRoutingRoutingModule { }
