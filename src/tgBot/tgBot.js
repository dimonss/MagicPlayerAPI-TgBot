import TelegramApi from 'node-telegram-bot-api';
import { COMMAND, tgBotDisplayCommands} from './constants/tgBotConstants.js';
import TgBotUtilsImpl from './implementations/reqest/tgBotUtilsImpl.js';
import TgBotClientImpl from "./implementations/reqest/tgBotClientImpl.js";


const tgBot = (token) => {
    const bot = new TelegramApi(token, {polling: true});
    bot.setMyCommands(tgBotDisplayCommands).then();
    bot.on('message', async (msg) => {
        const text = msg?.text;
        const utils = new TgBotUtilsImpl(bot, msg);
        const client = new TgBotClientImpl(bot, msg);

        console.log('msg');
        console.log(msg);

        //COMMON////////////////////////////////////////////////////////////////////////////////////////////////////

        if (text === COMMAND.START) {
            await utils.start();
            return;
        }
        if (text === COMMAND.INFO) {
            await utils.info()
            return;
        }
        if (text === COMMAND.CHAT_ID) {
            await utils.getChatId()
            return
        }
        //CLIENT////////////////////////////////////////////////////////////////////////////////////////////////////
        if (text === COMMAND.GENERATE_PASSWORD) {
            await client.setAndUpdatePassword()
            return
        }
        if (msg?.contact?.phone_number) {
            await client.clientRegistration()
            return
        }
        await utils.errorRequest()
    });
    return bot
};
export default tgBot;
