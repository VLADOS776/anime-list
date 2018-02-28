const Plugins = require('./plugin'),
      async = require('async'),
      shikiOnline = require('./js/online'),
      readManga = require('./js/sources/readmanga.me.js');
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
    } else {
        sources = Object.keys(sources).map(key => sources[key]);
        sources = [].concat.apply([], sources);
    }

    sources = sources.filter(source => typeof source.search === 'function' && (source.active === true || typeof source.active === 'undefined'));

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
            callback('Источник не найден');
        }
    } else {
        callback('Нет источников этого типа');
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
    if (!info.anime.source || info.anime.source.match(/shikimori/)) {
        info.anime.source = 'shikimori.org';
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

/**
 * Читать мангу
 * @param {Object} info - Информация
 * @param {Object} info.manga - Манга
 * @param {Object} info.read - Информация по просмотру
 * @param {number} info.read.volume - Номер тома
 * @param {number} info.read.chapter - Номер главы
 * @param {number} info.read.page - Номер страницы
 * @param {string} info.action - Действие пользователя. "page" - Переход на другую страницу, "chapter" - Переход на другую главу
 * @callback callback - Callback
 */
module.exports.read = function(info, callback) {
    /*if (!info.manga.source || info.manga.source.match(/readmanga|shikimori/)) {
        readReadmanga(info, callback);
        return;
    }*/

    let type = info.manga.type || 'manga';
    let sources = Plugins.getAllSources();
    if (sources[type]) {
        let filter = sources[type].find(itm => itm.opt.source === info.manga.source);

        if (filter && filter.read) {
            filter.read(info, callback);
        } else {
            callback(null);
        }
    } else {
        callback(null);
    }
}

function readReadmanga(info, callback) {
    if (info.action === 'chapter') {
        readManga.getChapter(info.link, callback)
    }
}