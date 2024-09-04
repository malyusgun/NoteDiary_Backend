import TelegramBot from 'node-telegram-bot-api';
import * as route from '../routes/telegramBot';

export const bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, { polling: true });

export const connectBot = async () => {
  await bot.setMyCommands([
    { command: '/start', description: 'Начать' },
    { command: '/info', description: 'Информация о боте' }
  ]);

  bot.on('message', async (message) => {
    const chatId = message.chat.id;
    const text = message.text!;
    if (text === '/start') {
      await route.sendMessageOnStart(chatId);
    }
    if (text === '/info') {
      await route.sendMessageOnInfo(chatId);
    }
    const firstWord = text.split(' ')?.[0];
    const firstTitle = text.split('\n')?.[0];
    if (
      ['Жалоба', 'жалоба', 'Complaint', 'complaint'].includes(firstWord) ||
      ['Жалоба', 'жалоба', 'Complaint', 'complaint'].includes(firstTitle)
    ) {
      await route.onComplaintResponse(chatId, text.split('').slice(6).join(''));
    }
    if (
      ['Пожелание', 'пожелание', 'Suggestion', 'suggestion'].includes(firstWord) ||
      ['Пожелание', 'пожелание', 'Suggestion', 'suggestion'].includes(firstTitle)
    ) {
      await route.onSuggestionResponse(chatId, text.split('').slice(9).join(''));
    }
  });
  bot.on('callback_query', async (req) => {
    const chatId = req.message!.chat.id;
    const data = req.data;

    if (data === '/start') {
      await route.sendMessageOnStart(chatId);
    }
    if (data === '/complaint') {
      await route.sendMessageOnComplaint(chatId);
    }
    if (data === '/suggestion') {
      await route.sendMessageOnSuggestion(chatId);
    }
    if (data === '/question') {
      await route.sendMessageOnQuestion(chatId);
    }
    if (data === '/textInfo') {
      await route.sendMessageOnTextInfo(chatId);
    }
    if (data === '/textSettingsGeneral') {
      await route.sendMessageOnTextSettingsGeneral(chatId);
    }
    if (data === '/textSettingsFont') {
      await route.sendMessageOnTextSettingsFont(chatId);
    }
    if (data === '/textSettingsPosition') {
      await route.sendMessageOnTextSettingsPosition(chatId);
    }
    if (data === '/imageInfo') {
      await route.sendMessageOnImageInfo(chatId);
    }
    if (data === '/imageSettingsGeneral') {
      await route.sendMessageOnImageSettingsGeneral(chatId);
    }
    if (data === '/imageSettingsFont') {
      await route.sendMessageOnImageSettingsFont(chatId);
    }
    if (data === '/imageSettingsPosition') {
      await route.sendMessageOnImageSettingsPosition(chatId);
    }
  });
};
