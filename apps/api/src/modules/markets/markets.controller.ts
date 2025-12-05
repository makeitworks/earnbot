import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { BinanceService } from '../binance/binance.service';
import { ExchangeInfoDto } from '../binance/dto/exchangeinfo.dto';

@Controller('markets')
export class MarketsController {
  constructor(
    private marketsService: MarketsService,
    private binanceService: BinanceService,
  ) {}

  @Get()
  getEnvTest() {
    return process.env.WANT;
  }

  @Get('binanceTradingPair')
  async getBinanceAllTradingPair() {
    return this.binanceService.getExchangeInfo();
  }
}
