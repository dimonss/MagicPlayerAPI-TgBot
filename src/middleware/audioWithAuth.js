import ClientSQL from "../db/ClientSQL.js";
import {commonDto} from "../DTO/common.js";
import {STATUS} from "../constants.js";

class AudioWithAuth {
    static get = (req, res, next) => {
        ClientSQL._findByToken(req?.headers?.auth, (error, client) => {
            if (error) return next(error);
            if (client === undefined) {
                res?.status(401).json(commonDto(STATUS.ERROR, 'Ошибка авторизации'));
                return
            }
            ProductSQL.all((error, product) => {
                if (error) return next(error);
                const favoriteList = JSON.parse(client?.favoriteProduct)
                const cartList = JSON.parse(client?.cart)
                const responseData = product.map(item => ({
                    favorite: favoriteList.find(id => id === item.id) !== undefined,
                    inCart: cartList.find(id => id[0] === item.id) !== undefined, ...item
                }))
                res.json(commonDto(STATUS.OK, 'success', responseData));
            }, req?.query?.search, req?.query?.categoryId)
        });
    };
    static find = (req, res, next) => {
        ClientSQL._findByToken(req?.headers?.auth, (error, client) => {
            if (error) return next(error);
            if (client === undefined) {
                res?.status(401).json(commonDto(STATUS.ERROR, 'Ошибка авторизации'));
                return
            }
            ProductSQL.find(req?.params?.searchText, (error, product) => {
                if (error) return next(error);
                const favoriteList = JSON.parse(client?.favoriteProduct)
                const cartList = JSON.parse(client?.cart)
                const responseData = product.map(item => ({
                    favorite: favoriteList.find(id => id[0] === item.id) !== undefined,
                    inCart: cartList.find(id => id[0] === item.id) !== undefined, ...item
                }))
                res.json(commonDto(STATUS.OK, 'success', responseData));
            })
        });
    };
    static findById = (req, res, next) => {
        ClientSQL._findByToken(req?.headers?.auth, (error, client) => {
            if (error) return next(error);
            if (client === undefined) {
                res?.status(401).json(commonDto(STATUS.ERROR, 'Ошибка авторизации'));
                return
            }
            ProductSQL.findById(req?.params?.id, (error, product) => {
                if (error) return next(error);
                const favoriteList = JSON.parse(client?.favoriteProduct)
                const cartList = JSON.parse(client?.cart)
                const responseData = {
                    ...product,
                    favorite: favoriteList.find(id => id === product.id) !== undefined,
                    inCart: cartList.find(id => id[0] === product.id) !== undefined
                }
                res.json(commonDto(STATUS.OK, 'success', responseData));
            })
        });
    };
}

export default AudioWithAuth