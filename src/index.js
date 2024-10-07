import express from 'express';
import ClientSQL from './db/ClientSQL.js';
import {commonDto} from './DTO/common.js';
import {STATUS} from './constants.js';
import fileUpload from 'express-fileupload';
import tgBot from './tgBot/tgBot.js';
import AudioWithAuth from "./middleware/audioWithAuth.js";
import {checkAuth} from "./utils/commonUtils.js";
import dotenv from 'dotenv';
import CryptoJS from "crypto-js";
import {v4 as uuidv4} from "uuid";

dotenv.config();
const HOSTNAME = process.env.HOSTNAME;
export const TG_TOKEN = process.env.TG_TOKEN;
console.log("TG_TOKEN");
console.log(TG_TOKEN);
export const AUTH = process.env.AUTH;
const PORT = process.env.PORT || 4000;

const app = express();
app.use(fileUpload({}));
export const bot = tgBot(TG_TOKEN);
const startApp = async () => {
    try {
        app.listen(PORT, HOSTNAME, () => {
            console.log(`Server started on ${PORT} port`);
        });
    } catch (e) {
        console.log('e');
        console.log(e);
    }
    app.use(express.json());

    //PRODUCT/////////////////////////////////////////////

    app.get('/product/search_with_auth/:searchText', AudioWithAuth.find);
    app.get('/product_with_auth', AudioWithAuth.get);
    app.get('/product_with_auth/:id', AudioWithAuth.findById);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    app.post('/file_image', (req, res) => {
        const file = req?.files.file;
        if (file.size < 1000000) {
            file.mv('/Users/macuser/Documents/my_project/ShopAPI/static/images/content/' + file?.name, (err) => {
                if (err) return res.status(400).send(err);
                return res.status(201).json(commonDto(STATUS.OK, 'created'));
            });
        } else {
            return res.status(201).json(commonDto(STATUS.ERROR, 'File size too large'));
        }
    });

    //CLIENT/////////////////////////////////////////////
    app.get('/clients', (req, res, next) => {
        if (checkAuth(req, res)) {
            ClientSQL.all((error, client) => {
                if (error) return next(error);
                res.json(commonDto(STATUS.OK, 'success', client));
            });
        }
    });
    app.get('/client/:id', (req, res, next) => {
        if (checkAuth(req, res)) {
            const id = req?.params?.id;
            ClientSQL.find(id, (error, client) => {
                if (error) return next(error);
                res.json(commonDto(client ? STATUS.OK : STATUS.NOT_FOUND, client ? 'found' : 'not found', client));
            });
        }
    });
    app.get('/client', (req, res, next) => {
        const token = req?.headers?.auth;
        ClientSQL.findByToken(token, (error, client) => {
            if (error) return next(error);
            if (!client) res.status(401).json(commonDto(STATUS.NOT_FOUND, 'Ошибка токена. Авторизуйтесь заново', client));
            else
                res.json(commonDto(STATUS.OK, client ? 'Токен валиден' : 'Ошибка токена. Авторизуйтесь заново', client));
        });
    });
    app.get('/auth', (req, res, next) => {
        const {login, password} = req?.headers;
        ClientSQL.findByLoginAndPassword({login, password: CryptoJS.SHA256(password).toString()}, (error, client) => {
            if (error) return next(error);
            if (client) {
                const token = uuidv4();
                ClientSQL.updateToken({token, clientId: client.id}, (error) => {
                    if (error) {
                        res.status(500).json(commonDto(STATUS.AUTH_ERROR, 'Не удалось сгенерировать токен'));
                    }
                    if (client) {
                        delete client.id
                        delete client.token
                        res.json(commonDto(STATUS.OK, 'Успешно авторизован', {token, ...client}));
                    }
                })
            } else {
                res.status(401).json(commonDto(STATUS.AUTH_ERROR, 'Ошибка авторизации'));
            }
        });
    });
};

startApp();
