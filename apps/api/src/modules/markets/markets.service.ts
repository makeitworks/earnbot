import { Injectable, Logger } from '@nestjs/common';
import { BinanceService } from '../binance/binance.service';

@Injectable()
export class MarketsService {
    private readonly logger = new Logger(MarketsService.name);
    
    constructor(private readonly binanceService: BinanceService) {}


}
