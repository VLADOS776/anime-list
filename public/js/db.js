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
db.anime.loadDatabase();

module.exports.anime = {};
module.exports.anime.get = function(query={}, sort={russian: 1}, callback) {
    db.anime.find(query).sort(sort).exec(function(err, docs) {
        if (err) console.error(err);
        
        if (typeof callback === 'function') callback(docs);
    })
}
module.exports.anime.getAll = function(callback) {
    db.anime.find({}).sort({ russian: 1}).exec(function(err, docs) {
        if (err) console.error(err);
        
        if (typeof callback === 'function') callback(docs);
    })
}

module.exports.anime.add = function(anime, callback) {
    db.anime.findOne({ id: anime.id }, function(err, doc) {
        if (!doc) {
            db.anime.insert(anime, function(err, newDoc) {
                if (err) console.err(err);

                if (typeof callback === 'function') callback(newDoc);
            })
        } else {
            if (typeof callback === 'function') callback(null, {'error': 'Already exists.'});
        }
    })
}

module.exports.anime.remove = function(animeId, callback) {
    db.anime.remove({ id: animeId }, {}, function(err, doc) {
        if (typeof callback === 'function') {
            if (doc) {
                callback(true);
            } else {
                callback(false);
            }
            
        }
    })
}

module.exports.anime.update = function(anime, callback) {
    db.anime.update({id: anime.id}, anime, {}, function(err, newDoc) {
        if (err) console.err(err);

        if (typeof callback === 'function') callback(newDoc);
    })
}

module.exports.anime.watchEp = function(animeId, ep, callback) {
    db.anime.update({id: animeId}, { $set: { 'watched': ep } }, {}, function(err, newDoc) {
        if (err) console.err(err);

        if (typeof callback === 'function') callback(newDoc);
    })
}

module.exports.anime.DB = db.anime