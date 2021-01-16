const sqlite3 = require('sqlite3');

import {remote} from 'electron'

let db;

function connection() {
    if(!db || !db.open) {
        db = new sqlite3.Database(`${remote.app.getPath('userData')}/storage.db`);
    }
    return db;
}

export const initDatabase = () => {
    return new Promise((resolve) => {
        let db = connection();
        db.serialize(() => {
            db.run('CREATE TABLE if not exists tracks (id INTEGER NOT NULL PRIMARY KEY, title text, author text, duration int, trackPath text, thumbPath text)');
            resolve();
        })
    });
}

export const addTrack = async (title, author, duration, trackPath, thumbPath) => {
    return new Promise((resolve, reject) => {
        let db = connection();
        db.serialize(() => {
            let insert = db.prepare("INSERT INTO tracks ('title', 'author', 'duration', 'trackPath', 'thumbPath') VALUES (?, ?, ?, ?, ?)");
            insert.run(title, author, duration, trackPath, thumbPath, function (err) {
                if(err) reject(err);
                resolve(this.lastID);
            });
        })
    });
}

export const getTrack = () => {
    return new Promise((resolve) => {
        let db = connection();
        db.serialize(() => {
            db.all("SELECT * FROM tracks ORDER BY id DESC", (err, row) => {
                if(err) return getTrack();
                else resolve(row);
            })
        })
    })
}

export const getTrackById = (id) => {
    return new Promise((resolve, reject) => {
        let db = connection();
        db.serialize(() => {
            const query = db.prepare('SELECT * FROM tracks WHERE id = ?');
            query.get(id, function (err, row) {
                if(err) reject(err);
                resolve(row);
            })
        })
    })
}