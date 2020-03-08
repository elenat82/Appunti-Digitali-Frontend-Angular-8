import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'content', loadChildren: () => import('../articoli/articoli.module').then(m => m.ArticoliModule)},
  { path: '', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
