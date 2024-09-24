import sqlite3 from 'sqlite3';

sqlite3.verbose();
const dbName = 'db.sqlite';
const audio = new sqlite3.Database(dbName);

class AudioSQL {
    static create(data, cb) {
        const sql = 'INSERT INTO audio(firstname, lastname, login, password, photo) VALUES (?,?,?,?,?)';
        try {
            audio.run(sql, data.firstname, data.lastname, data.login, data.password, data.photo, cb);
        } catch (err) {
            console.log('err');
            console.log(err);
        }
    }

    static registration(data, cb) {
        const sql = 'INSERT INTO audio(firstname, lastname, username, token, chatId, phoneNumber, photo ) VALUES (?,?,?,?,?,?,?)';
        try {
            audio.run(sql, data.firstName, data.lastName, data?.username, data.token, data.chatId, data.phoneNumber, data.photo, cb);
        } catch (err) {
            console.log('err');
            console.log(err);
        }
    }

    static all(cb) {
        audio.all('SELECT * FROM audio', cb);
    }

    static find(id, cb) {
        audio.get('SELECT * FROM audio WHERE id = ?', id, cb);
    }

    static findByChatId(id, cb) {
        audio.get('SELECT * FROM audio WHERE chatId = ?', id, cb);
    }

    static findByToken(token, cb) {
        audio.get('SELECT firstname, lastname, photo, favoriteProduct, cart, phoneNumber, token, discount FROM audio WHERE token = ?', token, cb);
    }

    static _findByToken(token, cb) {
        audio.get('SELECT * FROM audio WHERE token = ?', token, cb);
    }

    static updateCart(data, cb) {
        const sql = 'UPDATE audio SET cart = ? WHERE token = ?';
        audio.run(sql, data.cart, data.token, cb);
    }


    static update(data, cb) {
        const sql = 'UPDATE audio SET firstname = ?, lastname = ?, login = ?, password = ?, photo=? WHERE id = ?';
        audio.run(sql, data.firstname, data.lastname, data.login, data.password, data.photo, cb);
    }

    static delete(id, cb) {
        if (!id) return cb(new Error('Please provide an id'));
        audio.run(`DELETE FROM audio WHERE id = ?`, id, cb);
    }
}

export default AudioSQL;
