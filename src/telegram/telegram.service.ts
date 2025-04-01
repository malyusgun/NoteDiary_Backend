import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import * as helpers from './helpers/telegram.helpers';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  async onModuleInit() {
    this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, {
      polling: true,
    });

    await this.bot.setMyCommands([
      { command: '/start', description: 'Начать' },
      { command: '/info', description: 'Информация о боте' },
    ]);

    this.bot.on('message', async (message) => {
      const chatId = message.chat.id;
      const text = message.text!;
      if (text === '/start') {
        await helpers.sendMessageOnStart(this.bot, chatId);
      }
      if (text === '/info') {
        await helpers.sendMessageOnInfo(this.bot, chatId);
      }
      const firstWord = text.split(' ')?.[0];
      const firstTitle = text.split('\n')?.[0];
      if (
        ['Жалоба', 'жалоба', 'Complaint', 'complaint'].includes(firstWord) ||
        ['Жалоба', 'жалоба', 'Complaint', 'complaint'].includes(firstTitle)
      ) {
        await helpers.onComplaintResponse(
          this.bot,
          chatId,
          text.split('').slice(6).join(''),
        );
      }
      if (
        ['Пожелание', 'пожелание', 'Suggestion', 'suggestion'].includes(
          firstWord,
        ) ||
        ['Пожелание', 'пожелание', 'Suggestion', 'suggestion'].includes(
          firstTitle,
        )
      ) {
        await helpers.onSuggestionResponse(
          this.bot,
          chatId,
          text.split('').slice(9).join(''),
        );
      }
    });
    this.bot.on('callback_query', async (req) => {
      const chatId = req.message!.chat.id;
      const data = req.data;

      if (data === '/start') {
        await helpers.sendMessageOnStart(this.bot, chatId);
      }
      if (data === '/complaint') {
        await helpers.sendMessageOnComplaint(this.bot, chatId);
      }
      if (data === '/suggestion') {
        await helpers.sendMessageOnSuggestion(this.bot, chatId);
      }
      if (data === '/question') {
        await helpers.sendMessageOnQuestion(this.bot, chatId);
      }
      if (data === '/textInfo') {
        await helpers.sendMessageOnTextInfo(this.bot, chatId);
      }
      if (data === '/textSettingsGeneral') {
        await helpers.sendMessageOnTextSettingsGeneral(this.bot, chatId);
      }
      if (data === '/textSettingsFont') {
        await helpers.sendMessageOnTextSettingsFont(this.bot, chatId);
      }
      if (data === '/textSettingsPosition') {
        await helpers.sendMessageOnTextSettingsPosition(this.bot, chatId);
      }
      if (data === '/imageInfo') {
        await helpers.sendMessageOnImageInfo(this.bot, chatId);
      }
      if (data === '/imageSettingsGeneral') {
        await helpers.sendMessageOnImageSettingsGeneral(this.bot, chatId);
      }
      if (data === '/imageSettingsFont') {
        await helpers.sendMessageOnImageSettingsFont(this.bot, chatId);
      }
      if (data === '/imageSettingsPosition') {
        await helpers.sendMessageOnImageSettingsPosition(this.bot, chatId);
      }
    });
  }
}
