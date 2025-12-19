import { Injectable } from '@nestjs/common';
import { BaseWebsocketClient } from '../../../common/websocket/base-websocket-client';
import { Data } from 'ws';
import * as BinanceEnums from '../../../common/enums/binance.enums';

@Injectable()
export class BinanceCMFMarketWsClient extends BaseWebsocketClient {
  constructor() {
    super('wss://dstream.binance.com/ws');
  }

  private getCallback(name: string): (data: any) => void | null {
    return this.subscriptions.get(name);
  }

  private parseMiniTicker(payloads: any) {
    let callback = this.getCallback(BinanceEnums.CMFWsApi.MINI_TICKER.NAME);
    if(callback) {
      callback(payloads);
    } else {
      this.logger.log(`no ${BinanceEnums.CMFWsApi.MINI_TICKER.NAME} callback registered!`);
    }
  }

  protected handleMessage(data: Data): void {
    let payload = JSON.parse(data.toString());

    if (payload.result === null && payload.id) { // 订阅成功
      return;
    }

    // mini ticker
    if (Array.isArray(payload)) {
      if (payload[0].e && payload[0].e === BinanceEnums.CMFWsApi.MINI_TICKER.NAME) {
        this.parseMiniTicker(payload);
        return;
      }
    }
    if (typeof payload === 'object') {
      // mini ticker
      if (payload.e === BinanceEnums.CMFWsApi.MINI_TICKER.NAME) {
        this.parseMiniTicker([payload]);
        return;
      }

      // depth data
      if (payload.lastUpdateId && payload.bids && payload.asks) {
        const callback = this.getCallback(BinanceEnums.CMFWsApi.DEPTH.NAME);
        if (callback) {
          callback(payload);
        } else {
          this.logger.error(`no '${BinanceEnums.CMFWsApi.DEPTH.NAME}' callback registered!`);
        }
        return;
      }

      // book tiker data
      if (payload.u && payload.s && payload.b && payload.B && payload.a && payload.A) {
        const callback = this.getCallback(BinanceEnums.CMFWsApi.BOOK_TICKER.NAME);
        if (callback) {
          callback(payload);
        } else {
          this.logger.error(`no ${BinanceEnums.CMFWsApi.BOOK_TICKER.NAME} callback registered!`);
        }
        return;
      }
    }

    this.logger.error(`unkown stream data:${data.toString()}`);
  }
}
