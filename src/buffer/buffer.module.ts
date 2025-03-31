import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { BufferController } from './buffer.controller';
import * as express from 'express';
import * as cors from 'cors';
import { EntitiesService } from '../entities/entities.service';

@Module({
  imports: [EntitiesService],
  controllers: [BufferController],
})
export class BufferModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        express.raw({ type: 'image/jpeg', limit: '100mb' }),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-argument
        cors({
          credentials: true,
          origin: process.env.CLIENT_URL,
        }),
      )
      .forRoutes('/api/v1');
  }
}
