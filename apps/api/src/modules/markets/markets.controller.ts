import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { BinanceSpotService } from '../binance/spot/service';


@Controller('markets')
export class MarketsController {
  constructor(
    private marketsService: MarketsService,
    private binanceSpotService: BinanceSpotService,
  ) {}


}
