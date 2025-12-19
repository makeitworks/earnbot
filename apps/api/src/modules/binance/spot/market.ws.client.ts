import { Data } from 'ws';
import { BaseWebsocketClient } from '../../../common/websocket/base-websocket-client';
import { Injectable } from '@nestjs/common';
import * as BinanceEnums from '../../../common/enums/binance.enums';

@Injectable()
export class BinanceSpotMarketWsClient extends BaseWebsocketClient {
  constructor() {
    super('wss://stream.binance.com:443/ws');
  }

  private getCallback(name: string): (data:any)=>void | null {
    return this.subscriptions.get(name);
  }

  private parseMiniTicker(payloads: any) {
    let callback = this.getCallback(BinanceEnums.SpotWsApi.MINI_TICKER.NAME);
    if (callback) {
      callback(payloads);
    } else {
      this.logger.log(`no ${BinanceEnums.SpotWsApi.MINI_TICKER.NAME} callback registered!`);
    }
  }

  protected handleMessage(data: Data): void {
    let payload = JSON.parse(data.toString());

    // 订阅成功
    if (payload.result === null && payload.id) { 
      return;
    }

    // mini Ticker
    if (Array.isArray(payload)) {
      // mini ticker
      if (payload[0].e && payload[0].e === BinanceEnums.SpotWsApi.MINI_TICKER.NAME) {
        this.parseMiniTicker(payload);
        return;
      }
    }
    if (typeof payload === 'object') {
      if (payload.e) {
        // mini ticker
        if (payload.e === BinanceEnums.SpotWsApi.MINI_TICKER.NAME) {
          this.parseMiniTicker([payload])
          return;
        }

        // depth data
        if (payload.lastUpdateId && payload.bids && payload.asks) {
          const callback = this.getCallback(BinanceEnums.SpotWsApi.DEPTH.NAME);
          if (callback) {
            callback(payload);
          } else {
            this.logger.error(`no stream '${BinanceEnums.SpotWsApi.DEPTH.NAME}' callback registered!`);
          }
          return;
        }

        // book ticker data
        if ( payload.u && payload.s && payload.b && payload.B && payload.a && payload.A) {
          const callback = this.getCallback(BinanceEnums.SpotWsApi.BOOK_TICKER.NAME);
          if (callback) {
            callback(payload);
          } else {
            this.logger.error(`no '${BinanceEnums.SpotWsApi.BOOK_TICKER.NAME}' callback registered!`);
          }
          return;
        }
      }
    }

    this.logger.error(`unkown stream data:${data.toString()}`);
  }
}
