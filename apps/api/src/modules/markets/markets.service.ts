import { Injectable } from '@nestjs/common';
import { BinanceService } from '../binance/binance.service';

@Injectable()
export class MarketsService {
    constructor(private readonly binanceService: BinanceService) {}


}
