import { BaseApiService } from './services/baseApi.serivces';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonListPageComponent } from './components/person-list-page/person-list-page.component';
import { PersonService } from './services/person.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { HttpClient, HttpClientModule } from '@angular/common/http';

const modules = [NzTableModule];
@NgModule({
  declarations: [AppComponent, PersonListPageComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ...modules],
  providers: [PersonService, HttpClient],
  bootstrap: [AppComponent],
})
export class AppModule {}
