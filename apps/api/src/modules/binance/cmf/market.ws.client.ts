import { Injectable } from '@nestjs/common';
import { BaseWebsocketClient } from '../../../common/websocket/base-websocket-client';
import { Data } from 'ws';
import * as BinanceEnums from '../../../common/enums/binance.enums';

@Injectable()
export class BinanceCMFMarketWsClient extends BaseWebsocketClient {
  constructor() {
    super('wss://dstream.binance.com/ws');
  }

  protected handleMessage(data: Data): void {
    let payload = JSON.parse(data.toString());
    let streamName = payload.e;

    if (streamName) {
      const callback = this.subscriptions.get(streamName);
      if (callback) {
        callback(payload);
      } else {
        this.logger.error(
          `no stream '${streamName}' callback registered!!!, message: ${payload}`,
        );
      }
      return;
    }

    if(payload.result === null && payload.id) { // 订阅成功
      return ;
    }

    // book tiker data
    if (
      payload.u &&
      payload.s &&
      payload.b &&
      payload.B &&
      payload.a &&
      payload.A
    ) {
      const callback = this.subscriptions.get(
        BinanceEnums.CMFWsApi.BOOK_TICKER.NAME,
      );
      if (callback) {
        callback(payload);
      } else {
        this.logger.error(
          `no stream 'bookTiker' callback registered!!!, message: ${payload}`,
        );
      }
      return;
    }

    // depth data
    if (payload.lastUpdateId && payload.bids && payload.asks) {
      const callback = this.subscriptions.get(BinanceEnums.CMFWsApi.DEPTH.NAME);
      if (callback) {
        callback(payload);
      } else {
        this.logger.error(
          `no stream 'depth' callback registered!!!, message: ${payload}`,
        );
      }
      return;
    }

    this.logger.error(`unkown stream data:${data.toString()}`);
  }
}
