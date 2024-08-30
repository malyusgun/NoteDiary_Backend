import { bot } from '../telegramBot/index.js';
import { validateMessage } from '../helpers/index.js';
import path from 'node:path';
import * as fs from 'node:fs';

export const sendMessageOnStart = async (chatId) => {
  await bot.sendMessage(chatId, 'Что Вас интересует?', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Жалоба', callback_data: '/complaint' }],
        [{ text: 'Пожелание', callback_data: '/suggestion' }],
        [{ text: 'Вопрос по функционалу', callback_data: '/question' }]
      ]
    }
  });
};
export const sendMessageOnInfo = async (chatId) => {
  await bot.sendMessage(
    chatId,
    'Хотите отправить жалобу на работу приложения "ShelfNote", есть предложения по улучшению' +
      ' или вопросы по его функционалу? Напишите нам, и мы обязательно их рассмотрим🕵🏻🔎'
  );
};
export const sendMessageOnComplaint = async (chatId) => {
  await bot.sendMessage(
    chatId,
    'Опишите свою жалобу 😖\n<b>Внимание: необходимо первым словом ввести слово "жалоба".</b>\n\n<i>Рекомендуемый формат:</i>\n' +
      'Жалоба\n*Краткая суть жалобы* 🧐\n' +
      '*Описание сути проблемы, где она возникла и при каких обстоятельствах* ✍️',
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: 'Назад', callback_data: '/start' }]]
      }
    }
  );
};
export const sendMessageOnSuggestion = async (chatId) => {
  await bot.sendMessage(
    chatId,
    'Опишите своё пожелание ☺️<b>\nВнимание: необходимо первым словом ввести слово "пожелание"</b>\n\n<i>Рекомендуемый формат текста:</i>\n' +
      'Пожелание\n*Краткая суть предложения* 🤔\n' +
      '*Описание его сути, почему это важно и где стоит это добавить* ✍️',
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: 'Назад', callback_data: '/start' }]]
      }
    }
  );
};
export const sendMessageOnQuestion = async (chatId) => {
  await bot.sendMessage(chatId, 'Что Вас интересует?', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Параграфы', callback_data: '/textInfo' }],
        [{ text: 'Изображения', callback_data: '/imageInfo' }],
        [{ text: 'Назад', callback_data: '/start' }]
      ]
    }
  });
};
export const sendMessageOnTextInfo = async (chatId) => {
  await bot.sendMessage(
    chatId,
    '<b>Параграф</b>\n<i>Описание: </i>' +
      'Параграф, занимающий всю или половину ширины экрана. Используйте, если Вам нужен текст или заголовок с текстом.\n' +
      '<i>Возможности: </i>',
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Общие настройки', callback_data: '/textSettingsGeneral' }],
          [{ text: 'Настройка шрифта', callback_data: '/textSettingsFont' }],
          [{ text: 'Настройка положения', callback_data: '/textSettingsPosition' }],
          [{ text: 'Назад', callback_data: '/question' }]
        ]
      }
    }
  );
};
export const sendMessageOnTextSettingsGeneral = async (chatId) => {
  await bot.sendMessage(
    chatId,
    '<b>Общие настройки параграфа</b>' +
      '\n- Добавление заголовка и его удаление;' +
      '\n- Удаление параграфа;',
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: 'Назад', callback_data: '/textInfo' }]]
      }
    }
  );
};
export const sendMessageOnTextSettingsFont = async (chatId) => {
  await bot.sendMessage(
    chatId,
    '<b>Настройка шрифта</b>' +
      '\n - Изменение размера шрифта (один из пяти вариантов: "Very small", "Small", "Medium", "Large", "Extra large")',
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: 'Назад', callback_data: '/textInfo' }]]
      }
    }
  );
};
export const sendMessageOnTextSettingsPosition = async (chatId) => {
  await bot.sendMessage(
    chatId,
    '<b>Настройка положения параграфа</b>' +
      '\n- Изменение ширины параграфа (вся ширина экрана или половина);\n- Изменение положения заголовка (слева, по центру или справа);' +
      '\n- Изменение положения параграфа (влево, вправо или по центру, но при условии, что ширина параграфа выбрана половинчатой' +
      ' от ширины экрана);\n- Изменение позиции параграфа в списке (вверх или вниз, но при условии, что на странице есть что-то ещё).',
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: 'Назад', callback_data: '/textInfo' }]]
      }
    }
  );
};
export const sendMessageOnImageInfo = async (chatId) => {
  await bot.sendMessage(
    chatId,
    '<b>Изображение</b>\n<i>Описание: </i>' +
      'Изображение, к которому можно добавить параграф, занимающий вместе с ним всю ширину экрана или половину. ' +
      'Используйте, если Вам нужно изображение, возможно, с текстом и/или заголовком.\n' +
      '<i>Возможности: </i>',
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Общие настройки', callback_data: '/imageSettingsGeneral' }],
          [{ text: 'Настройка шрифта', callback_data: '/imageSettingsFont' }],
          [{ text: 'Настройка положения', callback_data: '/imageSettingsPosition' }],
          [{ text: 'Назад', callback_data: '/question' }]
        ]
      }
    }
  );
};
export const sendMessageOnImageSettingsGeneral = async (chatId) => {
  await bot.sendMessage(
    chatId,
    '<b>Общие настройки изображения</b>' +
      '\n- Добавление заголовка и его удаление;\n- Добавление текста и его удаление;' +
      '\n- Изменение размера изображения с сохранением пропорций (один из нескольких вариантов: ' +
      'x0.25, x0.5, x0.75, x1, x1.25, x1.5, x1.75 или x2, ' +
      'причём могут быть доступны не все варианты из перечисленных, поскольку размер изображения ограничен);' +
      '\n- Удаление параграфа;',
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: 'Назад', callback_data: '/imageInfo' }]]
      }
    }
  );
};
export const sendMessageOnImageSettingsFont = async (chatId) => {
  await bot.sendMessage(
    chatId,
    '<b>Настройка шрифта</b>' +
      '\n - Изменение размера шрифта (один из пяти вариантов: "Very small", "Small", "Medium", "Large", "Extra large")',
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: 'Назад', callback_data: '/imageInfo' }]]
      }
    }
  );
};
export const sendMessageOnImageSettingsPosition = async (chatId) => {
  await bot.sendMessage(
    chatId,
    '<b>Настройка положения блока с изображением</b>' +
      '\n- Изменение ширины параграфа (если он есть) (вся ширина экрана или половина);' +
      '\n- Изменение положения заголовка (если он есть) (слева, по центру или справа);' +
      '\n- Изменение положения параграфа (если он есть) (слева от изображения или справа);' +
      '\n- Изменение положения изображения (с параграфом, если он есть и ' +
      'его ширина выбрана половинчатой) (влево, вправо или по центру);' +
      '\n- Изменение позиции параграфа в списке (вверх или вниз, но при условии, что на странице есть что-то ещё).',
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: 'Назад', callback_data: '/imageInfo' }]]
      }
    }
  );
};
export const onComplaintResponse = async (chatId, complaint) => {
  try {
    const imagePath = path.join(
      path.resolve(),
      `/public/telegramBot/complaints/${complaint.split('').slice(0, 25).join('')}.txt`
    );
    fs.writeFileSync(imagePath, complaint);
    await validateMessage(
      complaint,
      'Ваша жалоба принята на рассмотрение.',
      'Некорректное содержание.',
      chatId
    );
  } catch (e) {
    await bot.sendMessage(chatId, 'Произошла ошибка на стороне сервера. Приносим свои извинения.');
    console.error('error: ', e);
  } finally {
    await sendMessageOnStart(chatId);
  }
};
export const onSuggestionResponse = async (chatId, suggestion) => {
  await validateMessage(
    suggestion,
    'Ваше предложение принято на рассмотрение.',
    'Некорректное содержание.',
    chatId
  );
  const imagePath = path.join(
    path.resolve(),
    `/public/telegramBot/suggestions/${suggestion.split('').slice(0, 25).join('')}.txt`
  );
  fs.writeFileSync(imagePath, suggestion);
  await sendMessageOnStart(chatId);
};
// export const sendMessageOn = async (chatId) => {
//   await bot.sendMessage(chatId, 'Что Вас интересует?', {
//     reply_markup: {
//       inline_keyboard: [
//         [{ text: 'Параграфы', callback_data: '/textInfo' }],
//         [{ text: 'Изображения', callback_data: '/imageInfo' }],
//         [{ text: 'Назад', callback_data: '/start' }]
//       ]
//     }
//   });
// };
// export const sendMessageOn = async (chatId) => {
//   await bot.sendMessage(chatId, 'Что Вас интересует?', {
//     reply_markup: {
//       inline_keyboard: [
//         [{ text: 'Параграфы', callback_data: '/textInfo' }],
//         [{ text: 'Изображения', callback_data: '/imageInfo' }],
//         [{ text: 'Назад', callback_data: '/start' }]
//       ]
//     }
//   });
// };
