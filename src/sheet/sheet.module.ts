import { Module } from '@nestjs/common';
import { SheetService } from './sheet.service';
import { SheetController } from './sheet.controller';
import { UserModule } from '../user/user.module';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [SheetService],
  controllers: [SheetController],
  imports: [UserModule, PrismaService],
  exports: [SheetService],
})
export class SheetModule {}
