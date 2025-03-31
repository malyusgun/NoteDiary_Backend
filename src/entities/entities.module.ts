import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';

@Module({
  providers: [EntitiesService],
  controllers: [EntitiesController],
})
export class EntitiesModule {}
