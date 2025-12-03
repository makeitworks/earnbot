import { Module } from '@nestjs/common';
import { OkxService } from './okx.service';
import { OkxSpotService } from './spot/spot.service';

@Module({
  providers: [OkxService, OkxSpotService],
  exports: [OkxService],
})
export class OkxModule {}
