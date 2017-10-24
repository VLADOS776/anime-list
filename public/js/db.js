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
     db[dbName].findOne({ id: item.id }, function(err, doc) {
        if (!doc) {
            db[dbName].insert(item, function(err, newDoc) {
                if (err) console.err(err);

                if (typeof callback === 'function') callback(newDoc);
            })
        } else {
            if (typeof callback === 'function') callback(null, {'error': 'Already exists.'});
        }
    })
}
function remove(dbName, itemId, callback) {
    db[dbName].remove({ id: itemId }, {}, function(err, doc) {
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
    db[dbName].update({id: item.id}, item, {}, function(err, newDoc) {
        if (err) console.err(err);

        if (typeof callback === 'function') callback(newDoc);
    })
}
function set(dbName, animeId, set, callback) {
    db[dbName].update({ id: animeId }, { $set: set }, {}, function(err, newDoc) {
        if (err) console.error(err);

        if (typeof callback === 'function') callback(newDoc);
    })
}

// TODO: Добавить функцию для создания дополнительный баз данных для плагинов.

// ====== Для плагинов ======

/**
 * Загружает базу данных
 * @param {string} name - имя базы данных
 * @returns {Promise} - Промис, который возвращает экземпляр базы данных
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
module.exports.anime.remove = function(animeId, callback) {
    remove('anime', animeId, callback);
}
module.exports.anime.update = function(anime, callback) {
    update('anime', anime, callback);
}
module.exports.anime.watchEp = function(animeId, ep, callback) {
    db.anime.update({id: animeId}, { $set: { 'watched': ep, 'lastWatched': Date.now() } }, {}, function(err, newDoc) {
        if (err) console.err(err);

        if (typeof callback === 'function') callback(newDoc);
    })
}
module.exports.anime.set = function(animeId, setObj, callback) {
    set('anime', animeId, setObj, callback);
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
module.exports.manga.remove = function(mangaId, callback) {
    remove('manga', mangaId, callback);
}
module.exports.manga.update = function(manga, callback) {
    update('manga', manga, callback);
}
module.exports.manga.readChapter = function(mangaId, readed, callback) {
    db.manga.update({id: mangaId}, { $set: { 'readed': readed, 'lastReaded': Date.now() } }, {}, function(err, newDoc) {
        if (err) console.err(err);

        if (typeof callback === 'function') callback(newDoc);
    })
}
module.exports.manga.bookmark = function(mangaId, bookmark, callback) {
    db.manga.update({id: mangaId}, { $set: { 'bookmark': bookmark, 'lastReaded': Date.now() } }, {}, function(err, newDoc) {
        if (err) console.err(err);

        if (typeof callback === 'function') callback(newDoc);
    })
}
module.exports.manga.set = function(mangaId, setObj, callback) {
    set('manga', mangaId, setObj, callback);
}
module.exports.manga.DB = db.manga;