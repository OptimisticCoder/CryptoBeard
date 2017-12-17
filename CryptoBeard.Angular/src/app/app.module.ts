import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CoinMarketCapService } from './services/coinmarketcap.service'

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
      AppComponent      
  ],
  imports: [
      BrowserModule,
      HttpModule,
      HttpClientModule
  ],
  providers: [CoinMarketCapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
