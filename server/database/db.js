const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'game.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the in-memory SQLITE game database.');

        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                username TEXT UNIQUE,
                password TEXT
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player1_id INTEGER,
                player2_id INTEGER,
                winner_id INTEGER,
                type TEXT "",
                index_id INTEGER,
                board TEXT DEFAULT '["","","","","","","","",""]', 
                current_turn INTEGER, 
                status TEXT DEFAULT 'waiting', 
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
});

module.exports = db;