import { Injectable } from '@nestjs/common';
import { BinanceCMFutureRestClient } from './spot.rest.client';
import { BinanceCMFutureWsClient } from './market.ws.client';

@Injectable()
export class BinanceCMFutureService {
  constructor(
    private readonly restClient: BinanceCMFutureRestClient,
    private readonly wsClient: BinanceCMFutureWsClient,
  ) {}
}
