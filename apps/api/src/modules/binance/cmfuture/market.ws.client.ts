import { Injectable } from "@nestjs/common";
import { BaseWebsocketClient } from "../../../common/websocket/base-websocket-client";
import { Data } from "ws";

@Injectable()
export class BinanceCMFutureWsClient extends BaseWebsocketClient {
  constructor() {
    super("wss://ws-dapi.binance.com/ws-dapi/v1")
  }

  protected handleMessage(data: Data): void {
    
  }
}