var request = require('request');

module.exports.getAnimeInfo = function(id, callback) {
    request({ url: "https://shikimori.org/api/animes/" + id }, function(err, response, body) {
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

module.exports.getRelated = function(id, callback) {
    request({ url: "https://shikimori.org/api/animes/" + id +'/related'}, function(err, response, body) {
        if (err) console.log(err);

        try {
            let related = JSON.parse(body);
            
            callback(null, related)
        } catch (e) {
            console.error(e)
            callback(e);
        }
    })
}