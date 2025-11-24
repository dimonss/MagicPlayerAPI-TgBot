import ClientSQL, { Client } from "../../../db/ClientSQL.js";
import { v4 as uuidv4 } from 'uuid';
import { COMMAND } from "../../constants/tgBotConstants.js";
import { TG_TOKEN } from "../../../index.js";
import download from '../../../utils/fileSaver.js';
import { getCurrentDate, getRandomNumber } from '../../../utils/commonUtils.js';
import CryptoJS from 'crypto-js';
import TelegramBot from 'node-telegram-bot-api';

class TgBotClientImpl {
    bot: TelegramBot;
    chatId: number;
    text?: string;
    msg: TelegramBot.Message;

    constructor(bot: TelegramBot, msg: TelegramBot.Message) {
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
            await this.bot.sendMessage(this.chatId, `Регистрация доступна только в личном чате с ботом\nОткройте личную переписку с ботом @DiChAdminBot`,);
            return;
        }
        if (this?.msg?.from?.is_bot) {
            await this.bot.sendMessage(this.chatId, `Регистрация для ботов запрещена!`);
            return;
        }
        if (!this?.msg?.from?.username) {
            await this.bot.sendMessage(this.chatId, `Для регистрации вам необходимо установить 'Username' в телеграмм`);
            return;
        }
        ClientSQL.findByChatId(this.msg.from.id, async (error, client) => {
            if (error) {
                await this.bot.sendMessage(this.chatId, `Упс.\nЧто то пошло не так.\nМы уже работаем над устранением ошибки\nПопробуйте позже`,);
                return;
            }
            if (!client) {
                if (!this.msg.from) return;
                var user_profile = this.bot.getUserProfilePhotos(this.msg.from.id);
                const token = uuidv4();
                user_profile.then(async (res) => {
                    let file_id;
                    try {
                        if (!res.photos || res.photos.length === 0 || res.photos[0].length === 0) {
                            throw new Error('No profile photos found');
                        }
                        file_id = res.photos[0][0].file_id;
                        await this.bot
                            .getFile(file_id)
                            .then(async (result) => {
                                const fileName = uuidv4() + '.' + result?.file_path?.split('.')[1];
                                download(`https://api.telegram.org/file/bot${TG_TOKEN}/${result.file_path}`, `static/images/client/${fileName}`, () => {
                                    ClientSQL.registration({
                                        firstName: this?.msg?.contact?.first_name,
                                        lastName: this?.msg?.contact?.last_name || '',
                                        username: this?.msg?.from?.username || '',
                                        token,
                                        chatId: this?.msg?.from?.id.toString(),
                                        phoneNumber: this?.msg?.contact?.phone_number,
                                        photo: "client/" + fileName,
                                        discount: 5,
                                        regDate: getCurrentDate(),
                                    }, async (err) => {
                                        if (err) {
                                            console.log(err);
                                            await this.bot.sendMessage(this.chatId, `Упс.\nЧто то пошло не так.\nМы уже работаем над устранением ошибки\nПопробуйте позже`,);
                                            return;
                                        }
                                        await this.bot.sendMessage(this.chatId, `Ваши контактные данные успешно сохранены, для установки пароля используйте команду ${COMMAND.GENERATE_PASSWORD}`,);
                                    },);
                                },);
                            })
                            .catch((e) => {
                                console.log('reg client with photo error');
                                console.log(e);
                            });
                    } catch (e) {
                        ClientSQL.registration({
                            firstName: this?.msg?.contact?.first_name,
                            lastName: this?.msg?.contact?.last_name || '',
                            username: this?.msg?.from?.username || '',
                            token,
                            chatId: this?.msg?.from?.id.toString(),
                            phoneNumber: this?.msg?.contact?.phone_number,
                            photo: '',
                            discount: 5,
                            regDate: getCurrentDate(),
                        }, async (err) => {
                            if (err) {
                                await this.bot.sendMessage(this.chatId, `Упс.\nЧто то пошло не так.\nМы уже работаем над устранением ошибки\nПопробуйте позже`,);
                                return;
                            }
                            await this.bot.sendMessage(this.chatId, `Ваши контактные данные успешно сохранены, для установки пароля используйте команду ${COMMAND.GENERATE_PASSWORD}`,);
                        },);
                    }
                });
            } else await this.bot.sendMessage(this.chatId, `Вы уже зарегистрированы в системе\nДля просмотра своих данных используйте команду: ` + COMMAND.INFO,);
        });
    }

    async setAndUpdatePassword(randomNumber = getRandomNumber()) {
        if (this?.msg?.chat?.type !== 'private') {
            await this.bot.sendMessage(this.chatId, `Регистрация доступна только в личном чате с ботом\nОткройте личную переписку с ботом @DiChAdminBot`,);
            return;
        }
        if (this?.msg?.from?.is_bot) {
            await this.bot.sendMessage(this.chatId, `Регистрация для ботов запрещена!`);
            return;
        }
        if (!this.msg.from) return;

        ClientSQL.findByChatId(this.msg.from.id, async (error, client) => {
            if (error) {
                await this.bot.sendMessage(this.chatId, `Упс.\nЧто то пошло не так.\nМы уже работаем над устранением ошибки\nПопробуйте позже`,);
                return;
            }
            if (client) {
                const password = randomNumber
                const login = client.username || '';
                if (!this.msg.from) return;
                ClientSQL.updatePassword({
                    password: CryptoJS.SHA256(password).toString(), login, chatId: this.msg.from.id
                }, async (error) => {
                    if (error) {
                        await this.bot.sendMessage(this.chatId, `Упс.\nЧто то пошло не так.\nМы уже работаем над устранением ошибки\nПопробуйте позже`,);
                        return;
                    }
                    await this.bot.sendMessage(this.chatId, `Ваш логин для авторизации: ${login} \nВаш пароль для авторизации: ${password}`,);
                })
            } else await this.bot.sendMessage(this.chatId, `Для установки пароля вам необходимо зарегистрироваться в системе. Используйте команду: ` + COMMAND.START,);
        });
    }

}

export default TgBotClientImpl