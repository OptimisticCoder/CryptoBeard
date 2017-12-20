import { CoinData } from './coindata.model';
import { Holding } from './holding.model';

export class AssetView {
    coinData: CoinData;
    holdings: Holding[];
}