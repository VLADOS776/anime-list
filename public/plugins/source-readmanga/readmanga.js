const request = require('request'),
      cheerio = require('cheerio');

const config = {
    id: 'source-readmanga',
    name: 'ReadManga',
    description: "Информация о манге с сайта ReadManga.me",
    author: 'VLADOS776',
    version: '1.0.0',
    type: 'manga',
    source: 'readmanga.me'
}

const requestHeaders = {
    'cookie': 'red_cookie=true',
    'Referer': 'readmanga.me'
}
const baseUrl = 'http://readmanga.me';
let allChapters = [];

module.exports = function(Plugin) {
    Plugin.newSource(config, {
        search: (query, callback) => {
            request.post({
                url: baseUrl + '/search/suggestion',
                form: {
                    query: query
                }
            }, function(err, response, body) {
                if (err) {
                    callback(err);
                    return
                }

                //let $ = cheerio.load(body),
                let ret = [];

                try {
                    body = JSON.parse(body);

                    body.suggestions.forEach(item => {
                        ret.push({
                            english: item.value,
                            russian: item.names ? item.names[0] : null,
                            link: baseUrl + item.link,
                            type: 'manga',
                            source: config.source
                        })
                    })
                } catch(e) {
                    return callback(e);
                }

                callback(null, ret.slice(0, 10));
            })
        },
        info: (item, callback) => {
            let url = item.link;

            if (url.indexOf('/vol') !== -1) {
                url = url.replace(/\/vol.*$/, '');
            }
            request({ url: url, headers: requestHeaders}, function(err, response, body) {
                if (err) {
                    callback(err);
                    return;
                }
                let $ = cheerio.load(body);
                
                let origin = (new URL(url)).origin;
                
                let russian = $('h1.names .name').text(),
                    name = $('h1.names .eng-name').text(),
                    cover = $('.picture-fotorama img').attr('src'),
                    score = parseFloat($('input[name="score"]').attr('value')),
                    genres = $('.elem_genre').text().split(',').map(g => g.trim()),
                    year = parseInt($('.elem_year').text()),
                    startReadLink = $('.read-first a').attr('href'),
                    volumes = 0,
                    chapters = 0;
                
                let description = '';
                $('.manga-description').contents().each((i, elem) => {
                    if (description === '') {
                        if (elem.type === 'text' && elem.data.trim()) {
                            description = elem.data.trim();
                        } else if (elem.name === "div") {
                            description = $(elem).text().trim();
                        }
                    }
                })
                
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
                    cover: cover,
                    score: score,
                    volumes: volumes,
                    chapters: chapters,
                    genres: genres,
                    year: year,
                    description: description,
                    //chapterLinks: chapterLinks,
                    startReadLink: startReadLink,
                    type: 'manga',
                    source: config.source,
                    external_links: [
                        {
                            url: url,
                            name: 'Read Manga'
                        }
                    ]
                })
            })
        },
        read: (opt, callback) => {
            let url;
            if (opt.read.url) {
                url = baseUrl + opt.read.url;
            } else if (opt.read.volume === 1 && opt.read.chapter === 1) {
                url = opt.manga.startReadLink;
            } else if (allChapters && allChapters.length) {
                url = baseUrl + allChapters[allChapters.length - opt.read.chapterIndex - 1].url
            } else {
                return callback('Link not found');
            }

            url = cpLink(url);

            request.get({ url: url, headers: requestHeaders }, function(err, response, body) {
                if (err) {
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
                    returnObj.nextChapter = true;
                } else {
                    returnObj.nextChapter = false;
                }
                // Prev chapter link
                let $ = cheerio.load(body);
                if ($('a.prevChapLink').length) {
                    let link = $('a.prevChapLink').attr('href');
                    if (link.match(/vol\d+\//)) {
                        returnObj.prevChapterLink = cpLink($('a.prevChapLink').attr('href'), origin);
                    }
                    returnObj.prevChapter = true;
                } else {
                    returnObj.prevChapter = false;
                }

                returnObj.chapters = [];

                $('#chapterSelectorSelect option').each(function() {
                    let val = $(this).attr('value');
                    let name = $(this).text();

                    let volume,
                        chapter;

                    try {
                        volume = val.match(/vol(\d+)\//)[1]
                        chapter = val.match(/vol\d+\/(.*?\d+)\??/)[1]
                    } catch (e) {
                        console.error(e);
                    }

                    returnObj.chapters.push({
                        volume: volume,
                        chapter: chapter,
                        name: name,
                        url: val
                    })
                })

                allChapters = returnObj.chapters;
                
                returnObj.volume = parseInt(url.match(/\/vol(\d+)/)[1]);
                returnObj.chapter = parseInt(url.match(/\/vol\d+\/(\d+)[\/?$]/)[1]);
                returnObj.image = imgArray[0];
                returnObj.link = url;
                
                callback(null, returnObj);
            })

        }
    })
}

function cpLink(link, origin) {
    if (link.indexOf('?mtr=1') === -1) link = link + '?mtr=1';
    if (origin) link = origin + link;
    return link;
}