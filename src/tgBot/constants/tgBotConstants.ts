export const COMMAND = {
    START: '/start', INFO: '/info', GENERATE_PASSWORD: '/generate_password', CHAT_ID: '/chat_id',
};

export const tgBotDisplayCommands = [{command: COMMAND.START, description: 'Запустить бота'}, {
    command: COMMAND.INFO,
    description: 'Информация'
}, {command: COMMAND.GENERATE_PASSWORD, description: 'Обновить/Установить пароль'},];
