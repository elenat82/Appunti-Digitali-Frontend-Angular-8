import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { ContentResolverService } from '../services/content-resolver.service';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'appunti', loadChildren: () => import('../articoli/articoli.module').then(m => m.ArticoliModule)},
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
