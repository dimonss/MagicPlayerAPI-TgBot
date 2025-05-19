import express, { Request, Response, NextFunction } from 'express';
import ClientSQL from './db/ClientSQL.js';
import { commonDto } from './DTO/common.js';
import { STATUS } from './constants.js';
import fileUpload, { UploadedFile } from 'express-fileupload';
import tgBot from './tgBot/tgBot.js';
import AudioWithAuth from "./middleware/audioWithAuth.js";
import { checkAuth } from "./utils/commonUtils.js";
import dotenv from 'dotenv';
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { CustomRequest, Client, CommonResponse } from './types/index.js';

dotenv.config();
const HOSTNAME = process.env.HOSTNAME || 'localhost';
export const TG_TOKEN = process.env.TG_TOKEN;
export const AUTH = process.env.AUTH;
const PORT = parseInt(process.env.PORT || '4000', 10);

const app = express();
app.use(fileUpload({}));
export const bot = tgBot(TG_TOKEN);

const startApp = async (): Promise<void> => {
    try {
        app.listen(PORT, HOSTNAME, () => {
            console.log(`Server started on ${PORT} port`);
        });
    } catch (e) {
        console.log('Error starting server:', e);
    }
    app.use(express.json());

    // PRODUCT ENDPOINTS
    app.get('/product/search_with_auth/:searchText', AudioWithAuth.find);
    app.get('/product_with_auth', AudioWithAuth.get);
    app.get('/product_with_auth/:id', AudioWithAuth.findById);

    // FILE UPLOAD ENDPOINT
    app.post('/file_image', (req: CustomRequest, res: Response) => {
        const file = req?.files?.file as UploadedFile;
        if (file && file.size < 1000000) {
            file.mv('/Users/macuser/Documents/my_project/ShopAPI/static/images/content/' + file.name, (err: Error | null) => {
                if (err) return res.status(STATUS.ERROR).send(err);
                return res.status(STATUS.OK).json(commonDto(STATUS.OK, 'created'));
            });
        } else {
            return res.status(STATUS.ERROR).json(commonDto(STATUS.ERROR, 'File size too large'));
        }
    });

    // CLIENT ENDPOINTS
    app.get('/clients', (req: Request, res: Response, next: NextFunction) => {
        if (checkAuth(req, res)) {
            ClientSQL.all((error: Error | null, client: Client[]) => {
                if (error) return next(error);
                res.json(commonDto(STATUS.OK, 'success', client));
            });
        }
    });

    app.get('/client/:id', (req: Request, res: Response, next: NextFunction) => {
        if (checkAuth(req, res)) {
            const id = req?.params?.id;
            ClientSQL.find(id, (error: Error | null, client: Client | null) => {
                if (error) return next(error);
                res.json(commonDto(client ? STATUS.OK : STATUS.NOT_FOUND, client ? 'found' : 'not found', client));
            });
        }
    });

    app.get('/client', (req: Request, res: Response, next: NextFunction) => {
        const token = req?.headers?.auth as string;
        ClientSQL.findByToken(token, (error: Error | null, client: Client | null) => {
            if (error) return next(error);
            if (!client) {
                res.status(STATUS.NOT_FOUND).json(commonDto(STATUS.NOT_FOUND, 'Ошибка токена. Авторизуйтесь заново', client));
            } else {
                res.json(commonDto(STATUS.OK, 'Токен валиден', client));
            }
        });
    });

    app.get('/auth', (req: Request, res: Response, next: NextFunction) => {
        const { login, password } = req?.headers as { login?: string; password?: string };
        if (!login || !password) {
            return res.status(STATUS.AUTH_ERROR).json(commonDto(STATUS.AUTH_ERROR, 'Missing login or password'));
        }

        ClientSQL.findByLoginAndPassword(
            { login, password: CryptoJS.SHA256(password).toString() },
            (error: Error | null, client: Client | null) => {
                if (error) return next(error);
                if (client) {
                    const token = uuidv4();
                    ClientSQL.updateToken({ token, clientId: client.id }, (error: Error | null) => {
                        if (error) {
                            res.status(STATUS.AUTH_ERROR).json(commonDto(STATUS.AUTH_ERROR, 'Не удалось сгенерировать токен'));
                        }
                        if (client) {
                            const { id, token: _, ...clientData } = client;
                            res.json(commonDto(STATUS.OK, 'Успешно авторизован', { token, ...clientData }));
                        }
                    });
                } else {
                    res.status(STATUS.AUTH_ERROR).json(commonDto(STATUS.AUTH_ERROR, 'Ошибка авторизации'));
                }
            }
        );
    });
};

startApp(); 