const request = require('request'),
      cheerio = require('cheerio'),
      log = require('../log');

function cpLink(link, origin) {
    if (link.indexOf('?mtr=1') === -1) link = link + '?mtr=1';
    link = origin + link;
    return link;
}

var requestHeaders = {
    'cookie': 'red_cookie=true'
}

module.exports = {
    config: {
        sites: ['readmanga.me', 'mintmanga.com']
    },
    /*
        Информация о манге
        url - ссылка вида 'readmanga.me/manga_name'
    */
    mangaInfo: function(url, callback) {
        // Удаляем лишнее
        if (url.indexOf('/vol') !== -1) {
            url = url.replace(/\/vol.*$/, '');
        }
        log.info('Loading info for manga ' + url)
        request({ url: url, headers: requestHeaders}, function(err, response, body) {
            if (err) {
                log.error(err);
                callback(err, null);
            }
            let $ = cheerio.load(body);
            
            let origin = (new URL(url)).origin;
            
            let russian = $('h1.names .name').text(),
                name = $('h1.names .eng-name').text(),
                score = parseFloat($('input[name="score"]').attr('value')),
                genres = $('.elem_genre').text().split(',').map(g => g.trim()),
                year = parseInt($('.elem_year').text()),
                description = $('.manga-description p').text(),
                startReadLink = $('.read-first a').attr('href'),
                volumes = 0,
                chapters = 0;
            
            if (startReadLink) startReadLink = origin + startReadLink;
            if (startReadLink && startReadLink.indexOf('?mtr=1') == -1) startReadLink = startReadLink + '?mtr=1'
            
            // Список томов и глав
            let readLastLink = $('.read-last a').attr('href');
            
            // Ссылки может не быть, если манга удалена.
            if (readLastLink) {
                volumes = parseInt(readLastLink.match(/vol(\d+)\//)[1]);
                chapters = parseInt(readLastLink.match(/\/(\d+)$/)[1]);
            }
            
            let chapterLinks = []
            $('.chapters-link tbody tr td a').each(function (index, a) {
                chapterLinks[index] = {
                    link: cpLink($(this).attr('href'), origin),
                    name: $(this).text().trim()
                }
            })
            chapterLinks.reverse();
            
            callback(null, {
                name: name,
                russian: russian,
                score: score,
                volumes: volumes,
                chapters: chapters,
                genres: genres,
                year: year,
                description: description,
                chapterLinks: chapterLinks,
                startReadLink: startReadLink
            })
        })
    },
    getChapters: function(url, callback) {
        // Удаляем лишнее
        if (url.indexOf('/vol') !== -1) {
            url = url.replace(/\/vol.*$/, '');
        }
        this.mangaInfo(url, function(err, manga) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, manga.chapterLinks)
            }
        })
    },
    
    /*
        Получить список ссылок на изображения для главы
        url - ссылка вида 'readmanga.me/manga_name/vol5/3?mtr=1'
        Ссылку на первую главу брать из mangaInfo.startReadLink
    */
    getChapter: function(url, callback) {
        request({ url: url, headers: requestHeaders }, function(err, response, body) {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }
            if (response.statusCode !== 200) {
                console.log(response);
                callback(response.statusCode);
                return;
            }
            
            let origin = (new URL(url)).origin;
            let returnObj = {};
            
            let tmp = body.match(/rm_h.init\((.*?)\)/gi);
            if (!tmp || !tmp.length) {
                callback("Can't find rm_h.init on page", null);
                return;
            }
            
            tmp = tmp[0].match(/\[(['"].*?)\]/g);
            if (!tmp || !tmp.length) {
                callback("Can't find images array on page", null);
                return;
            }
            
            let imgArray = tmp.map(item => {
                let url = item.replace(/\[['"](.*?)['"],['"](.*?)['"],['"](.*?)['"],.*?\]/g, '$2$1$3');
                if (url.startsWith('/')) {
                    url = origin + url;
                }
                return url;
            })
            
            returnObj.images = imgArray;
            
            // Next chapter link
            if (body.match(/nextChapterLink = "(.*?)"/)) {
                returnObj.nextChapterLink = cpLink(body.match(/nextChapterLink = "(.*?)"/)[1], origin);
            }
            // Prev chapter link
            let $ = cheerio.load(body);
            if ($('a.prevChapLink').length) {
                let link = $('a.prevChapLink').attr('href');
                if (link.match(/vol\d+\//)) {
                    returnObj.prevChapterLink = cpLink($('a.prevChapLink').attr('href'), origin);
                }
            }
            
            returnObj.volume = parseInt(url.match(/\/vol(\d+)/)[1]);
            returnObj.chapter = parseInt(url.match(/\/vol\d+\/(\d+)[\/?$]/)[1]);
            
            callback(null, returnObj);
        })
    },
}