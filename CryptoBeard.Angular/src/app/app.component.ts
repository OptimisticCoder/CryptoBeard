import { Component } from '@angular/core';
import { Portfolio } from './models/portfolio.model';
import { Asset } from './models/asset.model';
import { Holding } from './models/holding.model';
import { CoinData } from './models/coindata.model';
import { CoinMarketCapService } from './services/coinmarketcap.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
    screenMode: number = 0;
    data: CoinData[] = null;
    portfolio: Portfolio = null;
    selectedCurrencyId: string = null;
    assetCost: number = 0;
    assetUnits: number = 0;

    constructor(private coinService: CoinMarketCapService) {
        this.coinService.getCoinData().then(data => {
            this.data = data;
        });

        let ns = this;
        chrome.storage.sync.get('portfolio', function (items: any) {
            if (items == null || typeof items == 'undefined'|| typeof items.assets == 'undefined')
                ns.portfolio = new Portfolio();
            else
                ns.portfolio = items.portfolio;

            console.log('loaded: ' + JSON.stringify(items));
            console.log('typed: ' + JSON.stringify(ns.portfolio));
        });
    }

    addItem(): void {
        this.screenMode = 1;
        console.log(this.portfolio);
    }

    cancelAddItem(): void {
        this.screenMode = 0;
    }

    addAsset(): void {
        let holding = new Holding();
        holding.cost = this.assetCost;
        holding.units = this.assetUnits;

        let exists: boolean = false;
        for (var i = 0; i < this.portfolio.assets.length; ++i)
        {
            if (this.portfolio.assets[i].id == this.selectedCurrencyId)
            {
                exists = true;
                this.portfolio.assets[i].holdings.push(holding);
                break;
            }
        }

        if (!exists)
        {
            let asset: Asset = new Asset();
            asset.id = this.selectedCurrencyId;
            asset.holdings.push(holding);
            this.portfolio.assets.push(asset);
        }

        chrome.storage.sync.set({ 'portfolio': this.portfolio }, function () {            
            this.screenMode = 0;
        });
    }
}
