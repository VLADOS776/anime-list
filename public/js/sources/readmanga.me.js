const request = require('request'),
      cheerio = require('cheerio');

module.exports = {
    config: {
        sites: ['readmanga.me', 'mintmanga.com']
    },
    mangaInfo: function(url, callback) {
        request({ url: url }, function(err, response, body) {
            if (err) log.error(err);
            let $ = cheerio.load(body);
            
            let russian = $('h1.names .name').text(),
                name = $('h1.names .eng-name').text(),
                score = parseFloat($('input[name="score"]').attr('value')),
                volumes = parseInt($('.read-last a').attr('href').match(/vol(\d+)\//)[1]),
                chapters = parseInt($('.read-last a').attr('href').match(/\/(\d+)$/)[1]),
                genres = $('.elem_genre').text().split(',').map(g => g.trim()),
                year = parseInt($('.elem_year').text()),
                description = $('.manga-description p').text();
            
            let chapterLinks = []
            $('.chapters-link tbody tr td a').each(function (index, a) {
                chapterLinks[index] = {
                    link: $(this).attr('href'),
                    name: $(this).text().trim()
                }
            })
            
            callback({
                name: name,
                russian: russian,
                score: score,
                volumes: volumes,
                chapters: chapters,
                genres: genres,
                year: year,
                description: description,
                chapterLinks: chapterLinks
            })
        })
    },
    getChapter: function(url, callback) {
        request({ url: url }, function(err, response, body) {
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
            
            let origin = (new URL(url)).origin + '/';
            let returnObj = {};
            
            let tmp = body.match(/rm_h.init\((.*?)\)/gi);
            if (!tmp || !tmp.length) {
                callback(null);
                return;
            }
            
            tmp = tmp[0].match(/\[(['"].*?)\]/g);
            if (!tmp || !tmp.length) {
                callback(null);
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
                returnObj.nextChapterLink = origin + body.match(/nextChapterLink = "(.*?)"/)[1]
            }
            // Prev chapter link
            let $ = cheerio.load(body);
            if ($('a.prevChapLink').length) {
                let link = $('a.prevChapLink').attr('href');
                if (link.match(/vol\d+\//)) {
                    returnObj.prevChapterLink = origin + $('a.prevChapLink').attr('href');
                }
            }
            
            returnObj.volume = parseInt(url.match(/\/vol(\d+)/)[1]);
            returnObj.chapter = parseInt(url.match(/\/vol\d+\/(\d+)[\/?$]/)[1]);
            
            callback(null, returnObj);
        })
    },
}