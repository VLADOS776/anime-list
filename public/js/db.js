const Datastore = require('nedb'),
      fs = require('fs'),
      app = require('electron').remote.app,
      path  = require('path'),
      dbDirPath = path.join(app.getPath('userData'), 'dbs');

if (!fs.existsSync(dbDirPath)) {
    fs.mkdirSync(dbDirPath)
}

let db = {};

db.anime = new Datastore({ filename: path.join(dbDirPath, 'anime.db'), timestampData: true });
db.manga = new Datastore({ filename: path.join(dbDirPath, 'manga.db'), timestampData: true });
db.anime.loadDatabase();
db.manga.loadDatabase();

function get(dbName, query, sort, callback) {
     db[dbName].find(query).sort(sort).exec(function(err, docs) {
        if (err) console.error(err);
        
        if (typeof callback === 'function') callback(docs);
    })
}
function add(dbName, item, callback) {
    let search = item.id ? { id: item.id } : { name: item.name };
    if (item.source) {
        search.source = item.source;
    }
     db[dbName].findOne(search, function(err, doc) {
        if (!doc) {
            db[dbName].insert(item, function(err, newDoc) {
                if (err) console.error(err);

                if (typeof callback === 'function') callback(newDoc);
            })
        } else {
            if (typeof callback === 'function') callback(null, {'error': 'Already exists.'});
        }
    })
}
function remove(dbName, item, callback) {
    let query = {};
    if (item.id) {
        query = { id: item.id };
    } else if (item.name && item.source) {
        query = { name: item.name, source: item.source };
    }
    db[dbName].remove(query, {}, function(err, doc) {
        if (typeof callback === 'function') {
            if (doc) {
                callback(true);
            } else {
                callback(false);
            }
            
        }
    })
}
function update(dbName, item, callback) {
    let query = {};
    if (item.id) {
        query = { id: item.id };
    } else if (item.name && item.source) {
        query = { name: item.name, source: item.source };
    }
    db[dbName].update(query, item, {}, function(err, newDoc) {
        if (err) console.error(err);

        if (typeof callback === 'function') callback(newDoc);
    })
}
function set(dbName, item, set, callback) {
    let query = {};
    if (item.id) {
        query = { id: item.id };
    } else if (item.name && item.source) {
        query = { name: item.name, source: item.source };
    }
    db[dbName].update(query, { $set: set }, {}, function(err, newDoc) {
        if (err) console.error(err);

        if (typeof callback === 'function') callback(newDoc);
    })
}

// TODO: Добавить функцию для создания дополнительный баз данных для плагинов.

// ====== Для плагинов ======

/**
 * Загружает базу данных. Если такой базы нет - создает её и загружает.
 * @param {string} name - имя базы данных
 * @returns {Promise} - Промис, который возвращает экземпляр базы данных nedb
 */
module.exports.load = function(name) {
    return new Promise((res, rej) => {
        let base = new Datastore({ filename: path.join(dbDirPath, name + '.db'), timestampData: true });
        base.loadDatabase(function(err) {
            if (err) {
                rej(err);
            } else {
                res(base);
            }
        })
    })
}

// ====== Anime ======

module.exports.anime = {};
module.exports.anime.get = function(query={}, sort={russian: 1}, callback) {
    get('anime', query, sort, callback);
}
module.exports.anime.getAll = function(callback) {
    get('anime', {}, { russian: 1 }, callback);
}
module.exports.anime.add = function(anime, callback) {
    add('anime', anime, callback);
}
module.exports.anime.remove = function(anime, callback) {
    remove('anime', anime, callback);
}
module.exports.anime.update = function(anime, callback) {
    update('anime', anime, callback);
}
module.exports.anime.watchEp = function(anime, ep, callback) {
    let query = {};
    if (anime.id) {
        query = { id: anime.id };
    } else if (anime.name && anime.source) {
        query = { name: anime.name, source: anime.source };
    }

    db.anime.update(query, { $set: { 'watched': ep, 'lastWatched': Date.now() } }, {}, function(err, newDoc) {
        if (err) console.error(err);

        if (typeof callback === 'function') callback(newDoc);
    })
}
module.exports.anime.set = function(anime, setObj, callback) {
    set('anime', anime, setObj, callback);
}
module.exports.anime.DB = db.anime;

// ====== Manga ======

module.exports.manga = {};
module.exports.manga.get = function(query={}, sort={russian: 1}, callback) {
    get('manga', query, sort, callback);
}
module.exports.manga.getAll = function(callback) {
    get('manga', {}, { russian: 1 }, callback);
}
module.exports.manga.add = function(manga, callback) {
    add('manga', manga, callback);
}
module.exports.manga.remove = function(manga, callback) {
    remove('manga', manga, callback);
}
module.exports.manga.update = function(manga, callback) {
    update('manga', manga, callback);
}
module.exports.manga.readChapter = function(manga, readed, callback) {
    let query = {};
    if (manga.id) {
        query = { id: manga.id };
    } else if (manga.name && manga.source) {
        query = { name: manga.name, source: manga.source };
    }
    db.manga.update(query, { $set: { 'readed': readed, 'lastReaded': Date.now() } }, {}, function(err, newDoc) {
        if (err) console.error(err);

        if (typeof callback === 'function') callback(newDoc);
    })
}
module.exports.manga.bookmark = function(manga, bookmark, callback) {
    let query = {};
    if (manga.id) {
        query = { id: manga.id };
    } else if (manga.name && manga.source) {
        query = { name: manga.name, source: manga.source };
    }
    db.manga.update(query, { $set: { 'bookmark': bookmark, 'lastReaded': Date.now() } }, {}, function(err, newDoc) {
        if (err) console.error(err);

        if (typeof callback === 'function') callback(newDoc);
    })
}
module.exports.manga.set = function(manga, setObj, callback) {
    set('manga', manga, setObj, callback);
}
module.exports.manga.DB = db.manga;