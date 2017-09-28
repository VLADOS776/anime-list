/*
    TODO: Сканировать папку sources и брать оттуда скрипты для различных сайтов
*/
const RM = require('./sources/readmanga.me');

module.exports = {
    getChapter: function(url, callback) {
        RM.getChapter(url, callback)
    },
    getInfo: function(url, callback) {
        RM.mangaInfo(url, callback);
    }
}