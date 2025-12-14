import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async(configService: ConfigService) => {
        const mongo = configService.get('mongo');
        return {
          uri: mongo.uri,
          dbName: mongo.db,
          user: mongo.user,
          pass: mongo.pass
        }
      }
    })
  ],
  providers: [],
  exports: [],
})
export class MongodbModule {}
