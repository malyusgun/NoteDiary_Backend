import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';
import { SheetModule } from '../sheet/sheet.module';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [EntitiesService],
  controllers: [EntitiesController],
  imports: [SheetModule, PrismaService],
  exports: [EntitiesService],
})
export class EntitiesModule {}
