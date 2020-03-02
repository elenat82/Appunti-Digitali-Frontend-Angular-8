import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AngularMaterialModule } from './modules/angular-material.module';
import { MenuComponent } from './components/menu/menu.component';
import { FilterlistPipe } from './pipes/filterlist.pipe';
import { StorageModule } from '@ngx-pwa/local-storage';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    FilterlistPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    StorageModule.forRoot({ 
      IDBNoWrap: true,
      IDBDBName: 'appuntiDigitaliDB', // custom database name when in `indexedDB`
      LSPrefix: 'appuntiDigitaliDB' }) // prefix when in `localStorage` fallback
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
