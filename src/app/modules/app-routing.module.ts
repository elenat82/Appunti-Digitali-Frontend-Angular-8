import { ArticoloGuard } from './../articolo.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'appunti', loadChildren: () => import('../articoli/articoli.module').then(m => m.ArticoliModule), canActivate: [ArticoloGuard]},
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
