/**
 * Плагин Anime List 3.0 для получения информации с сайта http://animevost.org/
 */

const request = require('request'),
    cheerio = require('cheerio');

const site = 'http://animevost.org';

let cached = null;

module.exports = {
    config: {
        id: 'animevost',
        name: 'Animevost',
        sites: ['http://animevost.org/'],
        type: 'anime',
        can: {
            search: true,
            info: true,
            watch: true
        }
    },
    /**
     * Поиск по сайту
     * @param {Object} opt - Параметры поиска
     * @param {string} opt.search - Текст поиска
     * @returns {Promise} Promise с массивом результатов поиска
     */
    search: function(opt) {
        return new Promise((res, rej) => {
            request.post({ 
                url: site + '/index.php?do=search',
                form: {
                    do: 'search',
                    subaction: 'search',
                    story: opt.search,
                    x: 0,
                    y: 0
                }
            }, function(err, response, body) {
                if (err) rej(err);
                let $ = cheerio.load(body),
                    ret = [];

                $('.shortstoryHead').each(function() {
                    let item = {};
                    let a = $(this).find('a'),
                        name = $(a).text(),
                        names = name.split('/');

                    if (names.length) {
                        item.russian = names[0].trim();
                        item.english = names[1].replace(/\[.*?\]/g, '').trim();
                    } else {
                        item.russian = name;
                    }
                    item.link = $(a).attr('href');
                    
                    ret.push(item);
                })

                res(ret);
            })
        })
    },
    /**
     * Информация об аниме
     * @param {Object} opt - Параметры
     * @param {string} opt.url - Ссылка на страницу из функции search
     * @returns {Promise} Promise с информацией об аниме
     */
    info: function(opt) {
        return new Promise((res, rej) => {
            request({ url: opt.url }, function(err, response, body) {
                if (err) res([]);

                let $ = cheerio.load(body),
                    $info = $('.shortstoryContent'),
                    tmp,
                    ret = {};

                // Кэшируем страницу. Если пользователь будет смотреть онлайн,
                // не придется заново загружать.
                cached = {
                    link: opt.url,
                    body: body
                }
                
                tmp = $('.shortstoryHead');
                if (tmp.length) {
                    let name = tmp.text();
                        names = name.split('/');
                    
                    if (names.length) {
                        ret.russian = names[0].trim();
                        ret.name = names[1].replace(/\[.*?\]/g, '').trim();
                    } else {
                        ret.russian = name;
                        ret.name = name;
                    }

                    let aired = name.match(/\[\d+-(\d+) /);
                    if (aired) {
                        ret.episodes_aired = parseInt(aired[1]);
                    }
                }

                tmp = $info.find('img');
                if (tmp.length) {
                    ret.cover = $(tmp[0]).attr('src');
                    if (!ret.cover.startsWith('htt')) {
                        ret.cover = 'http://animevost.org/' + ret.cover;
                    }
                }

                tmp = $('.current-rating');
                if (tmp.length) {
                    let score = parseInt($(tmp).text());
                    score /= 10;
                    score = score.toFixed(1);
                    ret.score = score;
                }

                tmp = $info.find('p:contains("Год выхода")');
                if (tmp.length) {
                    ret.year = parseInt($(tmp).text().replace('Год выхода:', '').trim());
                }
                
                tmp = $info.find('p:contains("Жанр")');
                if (tmp.length) {
                    let genres = $(tmp).text().replace('Жанр:', '').trim();
                    ret.genres = genres.split(',').map(item => { return { russian: item.trim() } });
                }
                
                tmp = $info.find('p:contains("Тип")');
                if (tmp.length) {
                    let type = $(tmp).text().replace('Тип:', '').trim();
                    ret.type = type;
                }
                
                tmp = $info.find('p:contains("Количество серий")');
                if (tmp.length) {
                    let episodesText = $(tmp).text().replace('Количество серий:', '').trim(),
                        episodes = parseInt(episodesText);
                    ret.episodes = episodes;

                    let duration = episodesText.match(/\((\d+) мин/i);
                    if (duration) {
                        ret.duration = parseInt(duration[1])
                    }
                }
                
                tmp = $info.find('p:contains("Описание")');
                if (tmp.length) {
                    let descr = $(tmp).text().replace('Описание:', '').trim();
                    ret.description = descr;
                }

                ret.source = site;
                ret.url = opt.url;

                res(ret);
            })
        })
    },
    watch: function(opt) {

    }
}