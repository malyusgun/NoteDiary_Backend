import { Module } from '@nestjs/common';
import { SheetService } from './sheet.service';
import { SheetController } from './sheet.controller';
import { UserModule } from '../user/user.module';

@Module({
  providers: [SheetService],
  controllers: [SheetController],
  imports: [UserModule],
})
export class SheetModule {}
