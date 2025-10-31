import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  ThrottlerModule.forRoot({
    throttlers: [
      {
        ttl: 60000,
        limit: 10,
      },
    ],
  })
],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
