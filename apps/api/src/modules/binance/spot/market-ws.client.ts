import { Data } from "ws";
import { BaseWebsocketClient } from "../../../common/websocket/base-websocket-client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BinanceSpotMarketWsClient extends BaseWebsocketClient {
    constructor() {
        super("wss://stream.binance.com:9443/ws")
    }

    protected handleMessage(data: Data): void {
        
    }
}