import { Test, TestingModule } from '@nestjs/testing';
import { BinanceCMFutureService } from './cmfuture.service';

describe('CmfutureService', () => {
  let service: BinanceCMFutureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinanceCMFutureService],
    }).compile();

    service = module.get<BinanceCMFutureService>(BinanceCMFutureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
