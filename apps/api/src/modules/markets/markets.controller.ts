import { Controller, Get } from '@nestjs/common';

@Controller('markets')
export class MarketsController {
    @Get()
    getEnvTest() {
        return process.env.WANT;
    }
}
