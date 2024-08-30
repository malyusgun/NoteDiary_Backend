import { bot } from '../telegramBot/index.js';

export const validateMessage = async (response, command, alternateCommand, chatId) => {
  const regExp = /[a-zA-Zа-яА-Я]/g;
  const isValid = regExp.test(response);
  if (isValid) {
    await bot.sendMessage(chatId, command);
  } else {
    await bot.sendMessage(chatId, alternateCommand);
  }
};
