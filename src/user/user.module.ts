import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailService } from '../mail/mail.service';
import { EntitiesService } from '../entities/entities.service';
import { TokenService } from '../token/token.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [MailService, EntitiesService, TokenService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
