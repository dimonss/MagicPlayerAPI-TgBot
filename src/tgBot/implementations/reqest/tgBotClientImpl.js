import ClientSQL from "../../../db/ClientSQL.js";
import {v4 as uuidv4} from 'uuid';
import {COMMAND} from "../../constants/tgBotConstants.js";
import {TG_TOKEN} from "../../../index.js";
import download from '../../../utils/fileSaver.js';
import { getCurrentDate } from '../../../utils/commonUtils.js';



class TgBotClientImpl {
    constructor(bot, msg) {
        this.bot = bot;
        this.chatId = msg?.chat?.id;
        this.text = msg.text;
        this.msg = msg
    }

    async clientRegistration() {
        if (this?.msg?.from?.id !== this?.msg?.contact?.user_id) {
            await this.bot.sendMessage(this.chatId, `Вы можете использовать только свои контактные данные`);
            return;
        }
        if (this?.msg?.chat?.type !== 'private') {
            await this.bot.sendMessage(
                this.chatId,
                `Регистрация доступна только в личном чате с ботом\nОткройте личную переписку с ботом @DiChAdminBot`,
            );
            return;
        }
        if (this?.msg?.from?.is_bot) {
            await this.bot.sendMessage(this.chatId, `Регистрация для ботов запрещена!`);
            return;
        }
        ClientSQL.findByChatId(this.msg.from.id, async (error, client) => {
            if (error) {
                await this.bot.sendMessage(
                    this.chatId,
                    `Упс.\nЧто то пошло не так.\nМы уже работаем над устранением ошибки\nПопробуйте позже`,
                );
                return;
            }
            if (!client) {
                var user_profile = this.bot.getUserProfilePhotos(this.msg.from.id);
                const token = uuidv4();
                user_profile.then(async (res) => {
                    let file_id;
                    try {
                        file_id = res.photos[0][0].file_id;
                        await this.bot
                            .getFile(file_id)
                            .then(async (result) => {
                                const fileName = uuidv4() + '.' + result?.file_path?.split('.')[1];
                                download(
                                    `https://api.telegram.org/file/bot${TG_TOKEN}/${result.file_path}`,
                                    `static/images/client/${fileName}`,
                                    () => {
                                        ClientSQL.registration(
                                            {
                                                firstName: this?.msg?.contact?.first_name,
                                                lastName: this?.msg?.contact?.last_name || '',
                                                username: this?.msg?.from?.username || '',
                                                token,
                                                chatId: this?.msg?.from?.id,
                                                phoneNumber: this?.msg?.contact?.phone_number,
                                                photo: "client/"+fileName,
                                                discount: 5,
                                                regDate: getCurrentDate(),
                                            },
                                            async (err) => {
                                                if (err) {
                                                    console.log(err);
                                                    await this.bot.sendMessage(
                                                        this.chatId,
                                                        `Упс.\nЧто то пошло не так.\nМы уже работаем над устранением ошибки\nПопробуйте позже`,
                                                    );
                                                    return;
                                                }
                                                await this.bot.sendMessage(
                                                    this.chatId,
                                                    `Ваши контактные данные успешно сохранены, для авторизации на сайте используйте данную ссылку 👉<b><a href='${process.env.SITE_LINK}/?auth=${token}'>DiCh.kg</a></b>👈\nВоизбежании утечки данных не передавайте данное сообщение третим лицам`,
                                                    { parse_mode: 'HTML' },
                                                );
                                            },
                                        );
                                    },
                                );
                            })
                            .catch((e) => {
                                console.log('reg client with photo error');
                                console.log(e);
                            });
                    } catch (e) {
                        ClientSQL.registration(
                            {
                                firstName: this?.msg?.contact?.first_name,
                                lastName: this?.msg?.contact?.last_name || '',
                                username: this?.msg?.from?.username || '',
                                token,
                                chatId: this?.msg?.from?.id,
                                phoneNumber: this?.msg?.contact?.phone_number,
                                photo: '',
                                discount: 5,
                                regDate: getCurrentDate(),
                            },
                            async (err) => {
                                if (err) {
                                    await this.bot.sendMessage(
                                        this.chatId,
                                        `Упс.\nЧто то пошло не так.\nМы уже работаем над устранением ошибки\nПопробуйте позже`,
                                    );
                                    return;
                                }
                                await this.bot.sendMessage(
                                    this.chatId,
                                    `Ваши контактные данные успешно сохранены, для авторизации на сайте используйте данную ссылку 👉<b><a href='${process.env.SITE_LINK}/?auth=${token}'>DiCh.kg</a></b>👈\nВоизбежании утечки данных не передавайте данное сообщение третим лицам`,
                                    { parse_mode: 'HTML' },
                                );
                            },
                        );
                    }
                });
            } else
                await this.bot.sendMessage(
                    this.chatId,
                    `Вы уже зарегистрированы в системе\nДля просмотра своих данных используйте команду: ` +
                    COMMAND.INFO,
                );
        });
    }
}

export default TgBotClientImpl