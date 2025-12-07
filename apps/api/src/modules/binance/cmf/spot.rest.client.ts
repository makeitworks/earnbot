import { Injectable } from "@nestjs/common";
import { BaseRestClient } from "../../../common/http/base-rest-client";
import * as crypto from 'crypto';

@Injectable()
export class BinanceCMFRestClient extends BaseRestClient {
  constructor() {
    super('https://dapi.binance.com');
  }

  protected signRequest(params: Record<string, any>, apiSecret: string): Record<string, any> {
    const timestamp = Date.now();
    const queryString = new URLSearchParams({
      ...params,
      timestamp: timestamp.toString()
    }).toString();

    const signature = crypto.createHmac("sha256", apiSecret).update(queryString).digest("hex");
    return { ...params, timestamp, signature }
  }
}