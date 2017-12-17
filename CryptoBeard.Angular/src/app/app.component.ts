import { Component } from '@angular/core';
import { CoinMarketCapService } from './services/coinmarketcap.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
    screenMode: number = 0;
    data: any = null;

    constructor(private coinService: CoinMarketCapService) {
        this.coinService.getCoinData().then(data => {
            this.data = data;
        });
    }

    addItem(): void {
        this.screenMode = 1;
    }

    cancelAddItem(): void {
        this.screenMode = 0;
    }
}
