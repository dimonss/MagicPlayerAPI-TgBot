import sqlite3 from 'sqlite3';

const dbName = 'db.sqlite';

const SQLQueries = {
    // CLIENT
    client: `
    CREATE TABLE IF NOT EXISTS client
    (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    firstname TEXT NOT NULL, 
    lastname TEXT, 
    username TEXT, 
    login TEXT UNIQUE, 
    password TEXT,
    phoneNumber TEXT NOT NULL UNIQUE,
    photo TEXT,
    chatId TEXT NOT NULL UNIQUE,
    token TEXT UNIQUE,
    otp TEXT,
    discount INT NOT NULL DEFAULT 0,
    notifications TEXT NOT NULL DEFAULT '[]',
    trackList TEXT NOT NULL DEFAULT '[]'
    )
    `,
};

const db = new sqlite3.Database(dbName);

Object.entries(SQLQueries).forEach(async ([name, SQLQuery]) => {
    try {
        console.log('\x1b[34m', name);
        db.run(SQLQuery);
        console.log('\x1b[32m', 'completed');
        console.log('\x1b[0m', '');
    } catch (e) {
        console.log('\x1b[31m', 'error:' + e);
    }
});
db.close();
console.log('\x1b[32m', 'FULL COMPLETED');
console.log('\x1b[0m', '');
