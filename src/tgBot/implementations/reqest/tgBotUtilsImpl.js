import { MY_LOGO_STICKER} from "../../../constants.js";
import ClientSQL from "../../../db/ClientSQL.js";
import {COMMAND} from "../../constants/tgBotConstants.js";
import {getKeyboardWithPhoneNumberRequest} from "../../tgBotUtils.js";


class TgBotUtilsImpl {
    constructor(bot, msg) {
        this.bot = bot;
        this.chatId = msg?.chat?.id;
        this.text = msg.text;
        this.msg = msg;
        this.isPrivat = msg?.chat?.type === 'private';
    }

    async getChatId() {
        await this.bot.sendMessage(this.chatId, this.chatId)
    }

    async start() {
        await this.bot.sendSticker(this.chatId, MY_LOGO_STICKER);
            await this.bot.sendMessage(
                this.chatId,
                `Добро пожаловать! =) \nЗдесь можно получить логин и пароль для авторизации на сайте dich.tech/magic_player${
                    this.isPrivat
                        ? '\nДля регистрации отправьте свой контакт нажав на кнопку снизу 👇'
                        : 'Для получения ключей используйте личной переписке с ботом'
                } `,
                this.isPrivat ? getKeyboardWithPhoneNumberRequest() : {},
            );
    }

    async info() {
        ClientSQL.findByChatId(this.msg.from.id, async (error, client) => {
            if (error) {
                await this.bot.sendMessage(this.chatId, `Ваши данные не найдены`);
                return;
            }
            if (client) {
                await this.bot.sendMessage(this.chatId, `Вы идентифицированный пользователь` +
                    `\nВас зовут ${client?.firstname || '🤨'} ${(client?.lastname || '')}` +
                    `\nВаш номер: ${client?.phoneNumber}`
                );
            } else {
                await this.bot.sendMessage(this.chatId, `Вы не идентифицированный пользователь\nДля идентификации используйте команду: ` + COMMAND.START)
            }
        })
    }

    async errorRequest() {
        await this.bot.sendMessage(this.chatId, `Я тебя не понимаю... Попробуй еще раз!`);
    }
}

export default TgBotUtilsImpl