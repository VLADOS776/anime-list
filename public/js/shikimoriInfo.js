var request = require('request');

function main(url, callback) {
    request({ url: url }, function(err, response, body) {
        if (err) console.log(err);

        try {
            let anime = JSON.parse(body);
            
            callback(null, anime)
        } catch (e) {
            console.error(e)
            callback(e);
        }
    })
}

module.exports.anime = {};
module.exports.anime.info = function(id, callback) {
    main("https://shikimori.org/api/animes/" + id, callback);
}
module.exports.anime.related = function(id, callback) {
    main("https://shikimori.org/api/animes/" + id +'/related', callback);
}
module.exports.anime.externalLinks = function(id, callback) {
    main("https://shikimori.org/api/animes/" + id + '/external_links', callback);
}

module.exports.manga = {};
module.exports.manga.info = function(id, callback) {
    main("https://shikimori.org/api/mangas/" + id, callback);
}
module.exports.manga.related = function(id, callback) {
    main("https://shikimori.org/api/mangas/" + id + '/related', callback);
}
module.exports.manga.externalLinks = function(id, callback) {
    main("https://shikimori.org/api/mangas/" + id + '/external_links', callback);
}