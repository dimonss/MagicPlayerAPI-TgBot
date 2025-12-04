import express, { Request, Response, NextFunction } from 'express';
import ClientSQL, { Client } from './db/ClientSQL.js';
import { commonDto } from './DTO/common.js';
import { STATUS } from './constants.js';
import fileUpload, { UploadedFile } from 'express-fileupload';
import tgBot from './tgBot/tgBot.js';
import AudioWithAuth from "./middleware/audioWithAuth.js";
import { checkAuth } from "./utils/commonUtils.js";
import dotenv from 'dotenv';
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import AuthService from "./services/AuthService.js";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

dotenv.config();
const HOSTNAME = process.env.HOSTNAME || 'localhost';
export const TG_TOKEN = process.env.TG_TOKEN || '';
export const AUTH = process.env.AUTH;
const PORT = process.env.PORT || 4000;

const app = express();
app.use(fileUpload({}));
export const bot = tgBot(TG_TOKEN);
const startApp = async () => {
    try {
        app.listen(Number(PORT), HOSTNAME, () => {
            console.log(`Server started on ${PORT} port`);
        });
    } catch (e) {
        console.log('e');
        console.log(e);
    }
    app.use(express.json());

    // Swagger API Documentation
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    //PRODUCT/////////////////////////////////////////////

    /**
     * @swagger
     * /product/search_with_auth/{searchText}:
     *   get:
     *     summary: Search products with authentication
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: searchText
     *         required: true
     *         schema:
     *           type: string
     *         description: Search query text
     *     responses:
     *       200:
     *         description: Search results
     *       401:
     *         description: Unauthorized
     */
    app.get('/product/search_with_auth/:searchText', AudioWithAuth.find);

    /**
     * @swagger
     * /product_with_auth:
     *   get:
     *     summary: Get all products with authentication
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of products
     *       401:
     *         description: Unauthorized
     */
    app.get('/product_with_auth', AudioWithAuth.get);

    /**
     * @swagger
     * /product_with_auth/{id}:
     *   get:
     *     summary: Get product by ID with authentication
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Product ID
     *     responses:
     *       200:
     *         description: Product details
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Product not found
     */
    app.get('/product_with_auth/:id', AudioWithAuth.findById);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * @swagger
     * /file_image:
     *   post:
     *     summary: Upload an image file
     *     tags: [Files]
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *     responses:
     *       201:
     *         description: File uploaded successfully
     *       400:
     *         description: No files uploaded or file too large
     */
    app.post('/file_image', (req: Request, res: Response) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json(commonDto(STATUS.ERROR, 'No files were uploaded.'));
        }
        const file = req.files.file as UploadedFile;
        if (file.size < 1000000) {
            file.mv('/Users/macuser/Documents/my_project/ShopAPI/static/images/content/' + file?.name, (err: any) => {
                if (err) return res.status(400).send(err);
                return res.status(201).json(commonDto(STATUS.OK, 'created'));
            });
        } else {
            return res.status(201).json(commonDto(STATUS.ERROR, 'File size too large'));
        }
    });

    //CLIENT/////////////////////////////////////////////
    /**
     * @swagger
     * /clients:
     *   get:
     *     summary: Get all clients
     *     tags: [Clients]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of all clients
     *       401:
     *         description: Unauthorized
     */
    app.get('/clients', (req: Request, res: Response, next: NextFunction) => {
        if (checkAuth(req, res)) {
            ClientSQL.all((error, client) => {
                if (error) return next(error);
                res.json(commonDto(STATUS.OK, 'success', client));
            });
        }
    });

    /**
     * @swagger
     * /client/{id}:
     *   get:
     *     summary: Get client by ID
     *     tags: [Clients]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Client ID
     *     responses:
     *       200:
     *         description: Client details
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Client not found
     */
    app.get('/client/:id', (req: Request, res: Response, next: NextFunction) => {
        if (checkAuth(req, res)) {
            const id = req?.params?.id;
            ClientSQL.find(id, (error, client) => {
                if (error) return next(error);
                res.json(commonDto(client ? STATUS.OK : STATUS.NOT_FOUND, client ? 'found' : 'not found', client));
            });
        }
    });

    /**
     * @swagger
     * /client:
     *   get:
     *     summary: Verify client token
     *     tags: [Clients]
     *     parameters:
     *       - in: header
     *         name: auth
     *         required: true
     *         schema:
     *           type: string
     *         description: Authentication token
     *     responses:
     *       200:
     *         description: Token is valid
     *       401:
     *         description: Invalid token
     */
    app.get('/client', (req: Request, res: Response, next: NextFunction) => {
        const token = req?.headers?.auth;
        ClientSQL.findByToken(token as string, (error, client) => {
            if (error) return next(error);
            if (!client) res.status(401).json(commonDto(STATUS.NOT_FOUND, 'Ошибка токена. Авторизуйтесь заново', client));
            else
                res.json(commonDto(STATUS.OK, client ? 'Токен валиден' : 'Ошибка токена. Авторизуйтесь заново', client));
        });
    });

    /**
     * @swagger
     * /auth:
     *   get:
     *     summary: Authenticate user (legacy)
     *     tags: [Authentication]
     *     parameters:
     *       - in: header
     *         name: login
     *         required: true
     *         schema:
     *           type: string
     *       - in: header
     *         name: password
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Authentication successful
     *       401:
     *         description: Authentication failed
     */
    app.get('/auth', (req: Request, res: Response, next: NextFunction) => {
        const login = req.headers.login as string;
        const password = req.headers.password as string;
        ClientSQL.findByLoginAndPassword({ login, password: CryptoJS.SHA256(password).toString() }, (error, client) => {
            if (error) return next(error);
            if (client) {
                const token = uuidv4();
                if (!client.id) return res.status(500).json(commonDto(STATUS.ERROR, 'Client ID missing'));
                ClientSQL.updateToken({ token, clientId: client.id }, (error) => {
                    if (error) {
                        res.status(500).json(commonDto(STATUS.AUTH_ERROR, 'Не удалось сгенерировать токен'));
                    }
                    if (client) {
                        delete client.id
                        delete client.token
                        res.json(commonDto(STATUS.OK, 'Успешно авторизован', { token, ...client }));
                    }
                })
            } else {
                res.status(401).json(commonDto(STATUS.AUTH_ERROR, 'Ошибка авторизации'));
            }
        });
    });


    // NEW AUTH SERVICE ENDPOINTS ///////////////////////////////////////
    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: User login
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - login
     *               - password
     *             properties:
     *               login:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login successful
     *       401:
     *         description: Invalid credentials
     *       500:
     *         description: Internal server error
     */
    app.post('/auth/login', async (req: Request, res: Response) => {
        try {
            const { login, password } = req.body;
            const result = await AuthService.login(login, password);
            if (!result) {
                return res.status(401).json(commonDto(STATUS.AUTH_ERROR, 'Invalid credentials'));
            }
            res.json(commonDto(STATUS.OK, 'Login successful', result));
        } catch (e: any) {
            res.status(500).json(commonDto(STATUS.ERROR, 'Internal server error', e.message));
        }
    });

    /**
     * @swagger
     * /auth/verify:
     *   get:
     *     summary: Verify JWT token
     *     tags: [Authentication]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Token is valid
     *       401:
     *         description: Invalid or missing token
     */
    app.get('/auth/verify', (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json(commonDto(STATUS.AUTH_ERROR, 'No token provided'));

        const decoded = AuthService.verifyToken(token);
        if (!decoded) return res.status(401).json(commonDto(STATUS.AUTH_ERROR, 'Invalid token'));

        res.json(commonDto(STATUS.OK, 'Token valid', decoded));
    });
    /////////////////////////////////////////////////////////////////////
};

startApp();
