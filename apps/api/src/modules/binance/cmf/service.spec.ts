import { Test, TestingModule } from '@nestjs/testing';
import { BinanceCMFService } from './service';

describe('CmfutureService', () => {
  let service: BinanceCMFService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinanceCMFService],
    }).compile();

    service = module.get<BinanceCMFService>(BinanceCMFService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
