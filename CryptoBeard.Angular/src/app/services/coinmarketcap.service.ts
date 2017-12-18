import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { CoinData } from '../models/coindata.model';

@Injectable()
export class CoinMarketCapService {
    constructor(private http: Http) { }

    getCoinData(): Promise<CoinData[]> {
        return this.http.get('https://api.coinmarketcap.com/v1/ticker/')
            .toPromise()
            .then(response => JSON.parse(response.text()) as CoinData[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}