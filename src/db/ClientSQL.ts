import sqlite3 from 'sqlite3';

sqlite3.verbose();
const dbName = 'db.sqlite';
const client = new sqlite3.Database(dbName);

export interface Client {
    id?: number;
    firstname?: string;
    lastname?: string;
    username?: string;
    login?: string;
    password?: string;
    phoneNumber?: string | null;
    photo?: string;
    chatId?: string;
    token?: string | null;
    otp?: string;
    discount?: number;
    notification?: string;
    favoriteProduct?: string;
    cart?: string;
    trackList?: string;
    regDate?: string;
    firstName?: string; // Alias for firstname in some contexts
    lastName?: string; // Alias for lastname
}

class ClientSQL {
    static create(data: Client, cb: (err: Error | null) => void) {
        const sql = 'INSERT INTO client(firstname, lastname, login, password, photo) VALUES (?,?,?,?,?)';
        try {
            client.run(sql, data.firstname, data.lastname, data.login, data.password, data.photo, cb);
        } catch (err) {
            console.log('err');
            console.log(err);
        }
    }

    static registration(data: Client, cb: (err: Error | null) => void) {
        const sql = 'INSERT INTO client(firstname, lastname, username, token, chatId, phoneNumber, photo ) VALUES (?,?,?,?,?,?,?)';
        try {
            client.run(sql, data.firstName, data.lastName, data?.username, data.token, data.chatId, data.phoneNumber, data.photo, cb);
        } catch (err) {
            console.log('err');
            console.log(err);
        }
    }

    static all(cb: (err: Error | null, rows: Client[]) => void) {
        client.all('SELECT * FROM client', cb);
    }

    static find(id: number | string, cb: (err: Error | null, row?: Client) => void) {
        client.get('SELECT * FROM client WHERE id = ?', id, cb);
    }

    static findByChatId(id: number | string, cb: (err: Error | null, row?: Client) => void) {
        client.get('SELECT * FROM client WHERE chatId = ?', id, cb);
    }

    static findByToken(token: string, cb: (err: Error | null, row?: Client) => void) {
        client.get('SELECT firstname, lastname, username FROM client WHERE token = ?', token, cb);
    }

    static _findByToken(token: string, cb: (err: Error | null, row?: Client) => void) {
        client.get('SELECT * FROM client WHERE token = ?', token, cb);
    }

    static updateCart(data: { cart: string; token: string }, cb: (err: Error | null) => void) {
        const sql = 'UPDATE client SET cart = ? WHERE token = ?';
        client.run(sql, data.cart, data.token, cb);
    }

    static updateNotifications(data: { notification: string; token: string }, cb: (err: Error | null) => void) {
        const sql = 'UPDATE client SET notification = ? WHERE token = ?';
        client.run(sql, data.notification, data.token, cb);
    }

    static updateFavorites(data: { favorite: string; token: string }, cb: (err: Error | null) => void) {
        const sql = 'UPDATE client SET favoriteProduct = ? WHERE token = ?';
        client.run(sql, data.favorite, data.token, cb);
    }

    static update(data: Client, cb: (err: Error | null) => void) {
        const sql = 'UPDATE client SET firstname = ?, lastname = ?, login = ?, password = ?, photo=? WHERE id = ?';
        client.run(sql, data.firstname, data.lastname, data.login, data.password, data.photo, cb);
    }

    static delete(id: number | string, cb: (err: Error | null) => void) {
        if (!id) return cb(new Error('Please provide an id'));
        client.run(`DELETE FROM client WHERE id = ?`, id, cb);
    }

    static accountExist(login: string, cb: (err: Error | null, row?: Client) => void) {
        client.get(`SELECT id FROM client WHERE login = ?`, login, cb);
    }

    static cart(login: string, cb: (err: Error | null, row?: Client) => void) {
        client.get(`SELECT id FROM client WHERE login = ?`, login, cb);
    }

    static updatePassword(data: { password: string; login: string; chatId: number | string }, cb: (err: Error | null) => void) {
        const sql = 'UPDATE client SET password = ?, login= ? WHERE chatId = ?';
        client.run(sql, data.password, data.login, data.chatId, cb);
    }

    static findByLoginAndPassword(data: { login: string; password: string }, cb: (err: Error | null, row?: Client) => void) {
        client.get('SELECT id, firstname, lastname, photo, phoneNumber, token FROM client WHERE login = ? AND password = ? ', data.login, data.password, cb);
    }
    static updateToken(data: { token: string; clientId: number | string }, cb: (err: Error | null) => void) {
        const sql = 'UPDATE client SET token = ? WHERE id = ?';
        client.run(sql, data.token, data.clientId, cb);
    }
}

export default ClientSQL;
