import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { D3BarchartComponent } from './d3-barchart/d3-barchart.component';
import { ChartRealTimeComponent } from './chart-real-time/chart-real-time.component';
import { MinersService } from './miners.service';

@NgModule({
  declarations: [
    AppComponent,
    D3BarchartComponent,
    ChartRealTimeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    MinersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
