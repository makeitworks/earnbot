import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongodbService implements OnModuleInit, OnModuleDestroy {
    onModuleInit() {
        
    }

    onModuleDestroy() {
        
    }

    constructor(
        private configService: ConfigService
    ) {}


}
