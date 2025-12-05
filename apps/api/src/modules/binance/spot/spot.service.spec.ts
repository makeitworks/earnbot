import { Test, TestingModule } from '@nestjs/testing';
import { BinanceSpotService } from './spot.service';

describe('BinanceService', () => {
  let service: BinanceSpotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinanceSpotService],
    }).compile();

    service = module.get<BinanceSpotService>(BinanceSpotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
