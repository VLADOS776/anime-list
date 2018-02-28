const Shikimori = require('node-shikimori').Shikimori,
      request = require('request'),
      cheerio = require('cheerio');

const config = {
    id: 'source-shikimori-anime',
    name: 'Shikimori Anime',
    description: "Информация об аниме с сайта Shikimori",
    author: 'VLADOS776',
    version: '1.0.0',
    type: 'anime',
    source: 'shikimori.org'
}

let client = null;

Shikimori({}, (err, cl) => {
    if (err) {
        log.error(err);
    }
    client = cl;
});

module.exports = function(Plugin) {
    Plugin.newSource(config, {
        search: (query, callback) => {
            client.get('animes', { search: query, limit: 10 }, function(err, response, body) {
                if (response) {
                    response = response.map(itm => {
                        itm.source = 'shikimori.org';
                        itm.type = 'anime';
                        return itm;
                    })
                }

                callback(err, response);
            })
        },
        info: (item, callback) => {
            client.get('animes/' + item.id, (err, info, res) => {
                info.source = 'shikimori.org';
                info.type = 'anime';

                client.get('animes/' + item.id + '/related', (err, related, res) => {
                    info.related = related;
                    callback(err, info);
                })
            })
        },
        watch: (opt, callback) => {
            getPlayers(opt.anime.id, opt.watch.ep, opt.watch.video_id, callback)
        }
    })
}


function getPlayers(animeId, ep, videoId, callback) {
    if (typeof videoId === 'function') {
        callback = videoId;
        videoId = null;
    }
    let url = `https://play.shikimori.org/animes/${animeId}/video_online/${ep}${videoId ? `/${videoId}` : ''}`;
    load(url, callback);
        
    function load(url, callback) {
        request({ url: url }, function(err, response, body) {
            if (err) log.error(err);
            let $ = cheerio.load(body);

            if ($('.error-404').length) {
                log.error('Online. Error 404.', { animeId: animeId, episode: ep, videoID: videoId });
                let newLink = $('p a').attr('href');
                if (newLink !== '/') {
                    return load('https:' + $('p a').attr('href'), callback);
                } else {
                    callback(404);
                }
            }

            let mapFunc = function(i, el) {
                let $el = $(el);

                return {
                    video_id: $el.data('video_id'),
                    kind: $el.find('.video-kind').text(),
                    hosting: $el.find('.video-hosting').text(),
                    author: $el.find('.video-author').text(),
                    kindClass: $el.find('.video-kind').attr('class')
                }
            }

            let player = {
                embed: $('.b-video_player iframe').attr('src'),
                video_id: $('.b-video_player').data('video_id')
            }

            let fandub = $('.video-variant-group[data-kind="fandub"] .b-video_variant').map(mapFunc),
                sub = $('.video-variant-group[data-kind="subtitles"] .b-video_variant').map(mapFunc),
                raw = $('.video-variant-group[data-kind="raw"] .b-video_variant').map(mapFunc);

            callback({
                player: player,
                fandub: fandub,
                sub: sub,
                raw: raw
            })
        })
    }
}