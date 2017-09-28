const request = require('request'),
      cheerio = require('cheerio'),
      log = require('./log');

let videoDOM = null,
    domain = null;

module.exports.getPlayers = function(animeId, ep, videoId, callback) {
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
                log.error('Online. Error 404.', { animeId: animeId, episode: ep, videoID: videoId })
                return load('https:' + $('p a').attr('href'), callback);
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
            /*player.kind = $(`.b-video_variant[data-video_id="${defPlayer.video_id}"]`).eq(0).find('.video-kind').text();
            player.hosting = $(`.b-video_variant[data-video_id="${defPlayer.video_id}"]`).eq(0).find('.video-hosting').text();
            player.author = $(`.b-video_variant[data-video_id="${defPlayer.video_id}"]`).eq(0).find('.video-author').text();*/

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

module.exports.getVideo = function() {
    let url = document.getElementById('player').getAttribute('src');
    domain = /:\/\/(.*?)\//.exec(url);

    if (domain.length === 2) {
        domain = domain[1];
    } else {
        log.error('Wrong domain', { domain: domain, url: url });
        return null;
    }

    let iframe = document.getElementById('player'),
        body = iframe.contentWindow.document.body;

    switch (domain){
        case 'vk.com':
            videoDOM = body.querySelector('.videoplayer_media video');
            break;
    }

    if (typeof callback === 'function') callback(videoDOM);
}

module.exports.getVideoAsync = function(timer=1000, callback) {
    setTimeout(() => {
        module.exports.getVideo();
        if (typeof callback === 'function') callback(videoDOM);
    }, timer)
}

module.exports.getTime = function() {
    if (!videoDOM) {
        log.error('Сначала надо вызвать getVideo()')
        return null
    }
    
    return videoDOM.currentTime;
}