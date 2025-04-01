import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SheetModule } from './sheet/sheet.module';
import { EntitiesModule } from './entities/entities.module';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { TelegramModule } from './telegram/telegram.module';
import { UserController } from './user/user.controller';
import { SheetController } from './sheet/sheet.controller';
import { EntitiesController } from './entities/entities.controller';
import { UserService } from './user/user.service';
import { SheetService } from './sheet/sheet.service';
import { EntitiesService } from './entities/entities.service';
import { TokenService } from './token/token.service';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    UserModule,
    SheetModule,
    EntitiesModule,
    TokenModule,
    MailModule,
    TelegramModule,
  ],
  controllers: [UserController, SheetController, EntitiesController],
  providers: [
    UserService,
    SheetService,
    EntitiesService,
    TokenService,
    MailService,
  ],
})
export class AppModule {}
