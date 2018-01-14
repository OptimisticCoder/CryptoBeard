import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Asset } from './models/asset.model';
import { AssetView } from './models/assetview.model';
import { Holding } from './models/holding.model';
import { CoinData } from './models/coindata.model';
import { CoinMarketCapService } from './services/coinmarketcap.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    screenMode: number = 0;
    coinData: CoinData[] = null;
    portfolio: Asset[] = null;
    viewData: AssetView[] = null;
    selectedCurrencyId: string = null;
    assetCost: number = 0;
    assetUnits: number = 0;
    totalProfit: number = 0;
    totalInvested: number = 0;
    totalValue: number = 0;

    constructor(private coinService: CoinMarketCapService, private changeDetector: ChangeDetectorRef) {
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
        for (var i = 0; i < this.portfolio.length; ++i)
        {
            if (this.portfolio[i].id == this.selectedCurrencyId)
            {
                exists = true;
                this.portfolio[i].holdings.push(holding);
                break;
            }
        }

        if (!exists)
        {
            let asset: Asset = new Asset();
            asset.id = this.selectedCurrencyId;
            asset.holdings.push(holding);
            this.portfolio.push(asset);
        }

        chrome.storage.sync.set({ 'portfolio': this.portfolio }, function () {            
        });
        this.screenMode = 0;
    }

    remove(toDelete: any, parentAsset: any): void {
        this.screenMode = 2;
    }

    ngOnInit(): void {
        let ns = this;
        chrome.storage.sync.get('portfolio', function (items: any) {
            if (items == null || typeof items == 'undefined' || typeof items.portfolio == 'undefined')
                ns.portfolio = [];
            else if (typeof items.portfolio.assets != 'undefined')
                ns.portfolio = items.portfolio.assets;
            else
                ns.portfolio = items.portfolio;

            ns.coinService.getCoinData().then(data => {
                ns.coinData = data;

                ns.viewData = [];

                if (typeof ns.portfolio != 'undefined')
                    for (let i = 0; i < ns.portfolio.length; ++i) {
                        for (let j = 0; j < ns.coinData.length; ++j) {
                            if (ns.coinData[j].id == ns.portfolio[i].id) {
                                let asset = new AssetView();
                                asset.coinData = ns.coinData[j];
                                asset.holdings = ns.portfolio[i].holdings;
                                ns.viewData.push(asset);

                                for (let k = 0; k < ns.portfolio[i].holdings.length; ++k) {
                                    ns.totalInvested += ns.portfolio[i].holdings[k].cost;
                                    ns.totalValue += ((ns.portfolio[i].holdings[k].units * asset.coinData.price_usd) - ns.portfolio[i].holdings[k].cost);
                                }
                                break;
                            }
                        }
                    }

                ns.totalProfit = ns.totalValue - ns.totalInvested;
                ns.changeDetector.detectChanges();
            });
        });
    }
}
