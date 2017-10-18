/**
 * Плагин Anime List 3.0 для получения информации с сайта http://animevost.org/
 */

const request = require('request'),
    cheerio = require('cheerio');

const site = 'http://yummyanime.com/';

let cached = null;

module.exports = {
    config: {
        id: 'yummyanime',
        name: 'Yummy Anime',
        sites: ['http://yummyanime.com'],
        type: 'anime',
        can: {
            search: true,
            info: true,
            watch: true
        }
    },
    search: function(opt) {
        return new Promise((res, rej) => {
            request.get(site + 'search?word=' + encodeURI(opt.search), function(err, response, body) {
                let $ = cheerio.load(body),
                    ret = [];

                $('.content-page .anime-column').each(function() {
                    let item = {},
                        tmp;
                    
                    item.year = parseInt($(this).find('.year-block').text());
                    item.cover = site + $($(this).find('img')[0]).attr('src');

                    tmp = $(this).find('.anime-title');
                    item.name = tmp.text();
                    item.link = site + tmp.attr('href');
                    item.type = $(this).find('.anime-type').text();

                    tmp = $(this).find('.rating-info').text();
                    tmp = tmp.match(/(\d+(?:\.\d+)?) из/);
                    if (tmp) {
                        item.score = parseFloat(tmp[1]);
                    }

                    ret.push(item);
                })

                res(ret);
            })
        })
    }
}