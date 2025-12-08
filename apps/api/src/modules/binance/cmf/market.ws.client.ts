import { Injectable } from "@nestjs/common";
import { BaseWebsocketClient } from "../../../common/websocket/base-websocket-client";
import { Data } from "ws";

@Injectable()
export class BinanceCMFMarketWsClient extends BaseWebsocketClient {
  constructor() {
    super("wss://dstream.binance.com/ws")
  }

  protected handleMessage(data: Data): void {
    let payload = JSON.parse(data.toString());
    let streamName = payload.e;

    const callback = this.subscriptions.get(streamName);
    if (callback) {
      callback(payload)
    } else {
      this.logger.error(`no stream '${streamName}' callback registered! message: ${data.toString()}`);
    }
  }

}