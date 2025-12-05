import { Injectable, Logger } from '@nestjs/common';
import { BinanceSpotService } from '../binance/spot/spot.service';


@Injectable()
export class MarketsService {
    private readonly logger = new Logger(MarketsService.name);
    
    constructor(private readonly binanceSpotService: BinanceSpotService) {}


}
