import { BadRequestException, Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { BinanceSpotService } from '../binance/spot/service';
import { ExchangeEnum, PairTypeEnum } from '../../common/enums/exchange.enums';


@Controller('markets')
export class MarketsController {
  constructor(
    private marketsService: MarketsService,
  ) {}

  @Get("pairs")
  async getTradingPairs(@Query("exchange") exchange: ExchangeEnum, @Query("tradeType") tradeType: PairTypeEnum) {
    return this.marketsService.getTradingPairs(exchange, tradeType);
  }

}
