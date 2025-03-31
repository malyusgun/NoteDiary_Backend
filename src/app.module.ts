import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SheetController } from './sheet/sheet.controller';
import { SheetService } from './sheet/sheet.service';
import { UserService } from './user/user.service';
import { EntitiesService } from './entities/entities.service';
import { UserController } from './user/user.controller';
import { EntitiesController } from './entities/entities.controller';
import { SheetModule } from './sheet/sheet.module';
import { UserModule } from './user/user.module';
import { TokenService } from './token/token.service';
import { MailService } from './mail/mail.service';

@Module({
  imports: [SheetModule, UserModule],
  controllers: [
    AppController,
    SheetController,
    UserController,
    EntitiesController,
  ],
  providers: [
    AppService,
    SheetService,
    UserService,
    EntitiesService,
    TokenService,
    MailService,
  ],
})
export class AppModule {}
