import { Holding } from './holding.model';

export class Asset {
    id: string;
    holdings: Holding[] = [];
}