export const getKeyboardWithPhoneNumberRequest = () => ({
    reply_markup: {
        keyboard: [[{
            text: '📲 Оставить номер телефона',
            request_contact: true,
        }]],
        one_time_keyboard: true,
    },
})
