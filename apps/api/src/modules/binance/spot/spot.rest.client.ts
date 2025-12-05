import * as crypto from "crypto"
import { BaseRestClient } from "../../../common/http/base-rest-client";
import { URLSearchParams } from "url";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BinanceSpotRestClient extends BaseRestClient {
    constructor() {
        super('https://api.binance.com');
    }

   protected signRequest(params: Record<string, any>, apiSecret: string): Record<string,any> {
    const timestamp = Date.now();
    const queryString = new URLSearchParams({
        ...params,
        timestamp: timestamp.toString()
    }).toString();

    const signature = crypto.createHmac("sha256", apiSecret).update(queryString).digest("hex");
    return { ...params, timestamp, signature }
   }

}