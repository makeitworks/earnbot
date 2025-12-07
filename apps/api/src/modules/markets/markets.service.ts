import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { BinanceSpotService } from '../binance/spot/spot.service';


@Injectable()
export class MarketsService implements OnModuleInit {
    private readonly logger = new Logger(MarketsService.name);
    
    constructor(private readonly binanceSpotService: BinanceSpotService) {}


    onModuleInit() {
        this.logger.debug('--------> module init')
    }


    onSpotMarketWsOpen() {

    }

    onSpotMarketWsClose() {
        
    }

}
