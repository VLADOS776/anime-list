const Plugins = require('./plugin'),
      async = require('async'),
      shikiOnline = require('./js/online');
// TODO: Проверить, нужен ли вообще async

const shikimori = require('./js/shikimoriInfo');

module.exports.search = function(opt, callback) {
    let sources = Plugins.getAllSources(),
        query;

    if (typeof opt === 'string') {
        query = opt;
        opt = {
            query: query
        }
    } else {
        query = opt.query;
    }

    if (opt.type) {
        sources = sources[opt.type];
        if (opt.type === 'anime') {
            searchShikimoriAnime(query, callback);
        } else if (opt.type === 'manga') {
            searchShikimoriManga(query, callback);
        }
    } else {
        sources = Object.keys(sources).map(key => sources[key]);
        sources = [].concat.apply([], sources);

        searchShikimoriAnime(query, callback);
        searchShikimoriManga(query, callback);
    }

    sources = sources.filter(source => typeof source.search === 'function');

    sources = sources.map(source => source.search);

    sources.forEach(function(search) {
        search(query, function(error, result) {
            if (error) {
                console.error(error);
                return;
            }
    
            callback(result);
        })
    }, this);
}

module.exports.info = function(item, callback) {
    let sources = Plugins.getAllSources();
    if (sources[item.type]) {
        let filter = sources[item.type].find(itm => itm.opt.source == item.source);

        if (filter && filter.info) {
            filter.info(item, callback);
        } else {
            callback(null);
        }
    } else {
        callback(null);
    }
}

/**
 * Получить список ссылок на просмотр
 * @param {Object} info - Информация
 * @param {Object} info.anime - Аниме
 * @param {Object} info.watch - Информация по просмотру
 * @param {number} info.watch.ep - Номер эпизода
 * @param {Object} info.videos - Список уже загруженых эпизодов (если есть)
 * @param {boolean} info.videoOnly - Смена плеера, если true. Смена эпизода, если false.
 * @callback callback - Callback
 */
module.exports.watch = function(info, callback) {
    if (info.anime.source && info.anime.source.match('shikimori')) {
        watchShikimori(info, callback);
        return;
    }
    let type = info.anime.type || 'anime';
    let sources = Plugins.getAllSources();
    if (sources[type]) {
        let filter = sources[type].find(itm => itm.opt.source == info.anime.source);

        if (filter && filter.watch) {
            filter.watch(info, callback);
        } else {
            callback(null);
        }
    } else {
        callback(null);
    }
}

function searchShikimoriAnime(query, callback) {
    shikimori.client.get('animes', { search: query, limit: 10 }, function(err, response, body) {
        if (err) log.error(err);
        
        response = response.map(itm => {
            itm.source = 'shikimori.org';
            itm.type = 'anime';
            return itm;
        })

        callback(response);
    })
}
function searchShikimoriManga(query, callback) {
    shikimori.client.get('mangas', { search: query, limit: 10 }, function(err, response, body) {
        if (err) log.error(err);
        
        response = response.map(itm => {
            itm.source = 'shikimori.org';
            itm.type = 'manga';
            return itm;
        })

        callback(response);
    })
}

function watchShikimori(info, callback) {
    shikiOnline.getPlayers(info.anime.id, info.watch.ep, info.watch.video_id, function(vids) {
        if (typeof vids === 'number') {
            callback(null, { msg: 'Not found', code: 404 });
        } else {
            callback(vids);
        }
    })
}