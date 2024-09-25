import sqlite3 from 'sqlite3';

sqlite3.verbose();
const dbName = 'db.sqlite';
const client = new sqlite3.Database(dbName);

class ClientSQL {
    static create(data, cb) {
        const sql = 'INSERT INTO client(firstname, lastname, login, password, photo) VALUES (?,?,?,?,?)';
        try {
            client.run(sql, data.firstname, data.lastname, data.login, data.password, data.photo, cb);
        } catch (err) {
            console.log('err');
            console.log(err);
        }
    }

    static registration(data, cb) {
        const sql = 'INSERT INTO client(firstname, lastname, username, token, chatId, phoneNumber, photo ) VALUES (?,?,?,?,?,?,?)';
        try {
            client.run(sql, data.firstName, data.lastName, data?.username, data.token, data.chatId, data.phoneNumber, data.photo, cb);
        } catch (err) {
            console.log('err');
            console.log(err);
        }
    }

    static all(cb) {
        client.all('SELECT * FROM client', cb);
    }

    static find(id, cb) {
        client.get('SELECT * FROM client WHERE id = ?', id, cb);
    }

    static findByChatId(id, cb) {
        client.get('SELECT * FROM client WHERE chatId = ?', id, cb);
    }

    static findByToken(token, cb) {
        client.get('SELECT firstname, lastname, photo, favoriteProduct, cart, phoneNumber, token, discount FROM client WHERE token = ?', token, cb);
    }

    static _findByToken(token, cb) {
        client.get('SELECT * FROM client WHERE token = ?', token, cb);
    }

    static updateCart(data, cb) {
        const sql = 'UPDATE client SET cart = ? WHERE token = ?';
        client.run(sql, data.cart, data.token, cb);
    }

    static updateNotifications(data, cb) {
        const sql = 'UPDATE client SET notification = ? WHERE token = ?';
        client.run(sql, data.notification, data.token, cb);
    }

    static updateFavorites(data, cb) {
        const sql = 'UPDATE client SET favoriteProduct = ? WHERE token = ?';
        client.run(sql, data.favorite, data.token, cb);
    }

    static update(data, cb) {
        const sql = 'UPDATE client SET firstname = ?, lastname = ?, login = ?, password = ?, photo=? WHERE id = ?';
        client.run(sql, data.firstname, data.lastname, data.login, data.password, data.photo, cb);
    }

    static delete(id, cb) {
        if (!id) return cb(new Error('Please provide an id'));
        client.run(`DELETE FROM client WHERE id = ?`, id, cb);
    }

    static accountExist(login, cb) {
        client.get(`SELECT id FROM client WHERE login = ?`, login, cb);
    }

    static cart(login, cb) {
        client.get(`SELECT id FROM client WHERE login = ?`, login, cb);
    }
    static updatePassword(data, cb) {
        const sql = 'UPDATE client SET password = ?, login= ? WHERE chatId = ?';
        client.run(sql, data.password, data.login, data.chatId, cb);
    }
}

export default ClientSQL;
