import { BrowserModule } from '@angular/platform-browser';
import { DiagramComponent } from './diagram/diagram.component';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AlertComponent } from './shared/alert/alert.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    DiagramComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
