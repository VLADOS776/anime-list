/*
    TODO: Сканировать папку sources и брать оттуда скрипты для различных сайтов
*/
const RM = require('./sources/readmanga.me');

module.exports = {
    getInfo: function(url, callback) {
        RM.mangaInfo(url, callback);
    },
    getChapters: function(url, callback) {
        RM.getChapters(url, callback);
    },
    getChapter: function(url, callback) {
        RM.getChapter(url, callback);
    },
}