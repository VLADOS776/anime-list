var Shikimori = require('node-shikimori').Shikimori,
    config = require('./config'),
    log = require('./log');

let opt = {};

if (config.get('shikimori.token')) {
    opt.token = config.get('shikimori.token');
} else if (config.get('shikimori.nickname') && config.get('shikimori.password')) {
    opt.nickname = config.get('shikimori.nickname');
    opt.password = config.get('shikimori.password');
}

let client = null;

if (!DEV) {
    Shikimori(opt, (err, cl) => {
        if (err) {
            log.error(err);
        }
        client = cl;
        module.exports.client = cl;
    });
}

module.exports.anime = {};
module.exports.anime.info = function(id, callback) {
    client.get('animes/' + id, (err, info, res) => {
        info.source = 'https://shikimori.org/';
        callback(err, info);
    })
}
module.exports.anime.related = function(id, callback) {
    client.get('animes/' + id + '/related', (err, info, res) => {
        callback(err, info);
    })
}
module.exports.anime.externalLinks = function(id, callback) {
    client.get('animes/' + id + '/external_links', (err, info, res) => {
        callback(err, info);
    })
}

module.exports.manga = {};
module.exports.manga.info = function(id, callback) {
    client.get('mangas/' + id, (err, info, res) => {
        info.source = 'https://shikimori.org/'
        callback(err, info);
    })
}
module.exports.manga.related = function(id, callback) {
    client.get('mangas/' + id + '/related', (err, info, res) => {
        callback(err, info);
    })
}
module.exports.manga.externalLinks = function(id, callback) {
    client.get('mangas/' + id + '/external_links', (err, info, res) => {
        callback(err, info);
    })
}