import { Request, Response, NextFunction } from 'express';
import ClientSQL from "../db/ClientSQL.js";
import { commonDto } from "../DTO/common.js";
import { STATUS } from "../constants.js";
import AudioSQL from "../db/AudioSQL.js"; // Assuming AudioSQL is the correct import

class AudioWithAuth {
    static get = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req?.headers?.auth;
        const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;

        ClientSQL._findByToken(token as string, (error, client) => {
            if (error) return next(error);
            if (client === undefined) {
                res?.status(401).json(commonDto(STATUS.ERROR, 'Ошибка авторизации'));
                return
            }
            AudioSQL.all((error: Error | null, product: any[]) => {
                if (error) return next(error);
                const favoriteList = JSON.parse(client?.favoriteProduct || '[]')
                const cartList = JSON.parse(client?.cart || '[]')
                const responseData = product.map((item: any) => ({
                    favorite: favoriteList.find((id: any) => id === item.id) !== undefined,
                    inCart: cartList.find((id: any) => id[0] === item.id) !== undefined, ...item
                }))
                res.json(commonDto(STATUS.OK, 'success', responseData));
            }, req?.query?.search as string, req?.query?.categoryId as string)
        });
    };
    static find = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req?.headers?.auth;
        const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;

        ClientSQL._findByToken(token as string, (error, client) => {
            if (error) return next(error);
            if (client === undefined) {
                res?.status(401).json(commonDto(STATUS.ERROR, 'Ошибка авторизации'));
                return
            }
            AudioSQL.find(req?.params?.searchText, (error: Error | null, product: any[]) => {
                if (error) return next(error);
                const favoriteList = JSON.parse(client?.favoriteProduct || '[]')
                const cartList = JSON.parse(client?.cart || '[]')
                const responseData = product.map((item: any) => ({
                    favorite: favoriteList.find((id: any) => id[0] === item.id) !== undefined,
                    inCart: cartList.find((id: any) => id[0] === item.id) !== undefined, ...item
                }))
                res.json(commonDto(STATUS.OK, 'success', responseData));
            })
        });
    };
    static findById = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req?.headers?.auth;
        const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;

        ClientSQL._findByToken(token as string, (error, client) => {
            if (error) return next(error);
            if (client === undefined) {
                res?.status(401).json(commonDto(STATUS.ERROR, 'Ошибка авторизации'));
                return
            }
            AudioSQL.findById(req?.params?.id, (error: Error | null, product: any) => {
                if (error) return next(error);
                const favoriteList = JSON.parse(client?.favoriteProduct || '[]')
                const cartList = JSON.parse(client?.cart || '[]')
                const responseData = {
                    ...product,
                    favorite: favoriteList.find((id: any) => id === product.id) !== undefined,
                    inCart: cartList.find((id: any) => id[0] === product.id) !== undefined
                }
                res.json(commonDto(STATUS.OK, 'success', responseData));
            })
        });
    };
}

export default AudioWithAuth