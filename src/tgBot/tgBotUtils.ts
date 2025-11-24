import { SendMessageOptions } from 'node-telegram-bot-api';

export const getKeyboardWithPhoneNumberRequest = (): SendMessageOptions => ({
    reply_markup: {
        keyboard: [[{
            text: '📲 Оставить номер телефона',
            request_contact: true,
        }]],
        one_time_keyboard: true,
    },
})
