const config = require('./js/config'),
      db = require('./js/db'),
      online = require('./js/online'),
      {anime: animeInfo} = require('./js/shikimoriInfo');

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      path = require('path');

const util = require('util'),
      EventEmmiter = require('events');

let SERVER = null;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'server', 'views'));

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/js', express.static(path.join(__dirname, 'js', 'libs')));
app.use('/serverjs', express.static(path.join(__dirname, 'server', 'js')));

app.use(bodyParser.urlencoded({extend: false }));
app.use(bodyParser.json());

function Server() {
    this.active = false;
}

util.inherits(Server, EventEmmiter);

/**
 * Запустить сервер
 */
Server.prototype.start = function() {
    app.get('/', (req, res) => {
        if (req.query && req.query.search) {
            shikimori.client.get('animes', { search: req.query.search, limit: 20 }, function(err, response, body) {
                if (err) log.error(err);
                res.render('search', { query: req.query.search, results: response });
            })
        } else {
            db.anime.getAll((animes) => {
                res.render('index', { animes: animes})
            })
        }
    })

    app.get('/anime/:id', (req, res) => {
        db.anime.get({ id: parseInt(req.params.id) }, { russian: 1 }, (anime) => {
            if (anime && anime.length) {
                related(anime[0]);
            } else {
                animeInfo.info(parseInt(req.params.id), (error, anime) => {
                    if (anime) {
                        related(anime);
                    }
                })
            }
        })

        function related(anime) {
            animeInfo.related(anime.id, (error, related) => {
                if (related) {
                    anime.related = related;
                }
                render(anime);
            })
        }
        function render(anime) {
            res.render('anime', {anime: anime});
        }
    })

    app.get('/watch/:id', (req, res) => {
        db.anime.get({ id: parseInt(req.params.id) }, { russian: 1 }, (anime) => {
            if (anime && anime.length) {
                render(anime[0]);
            } else {
                animeInfo.info(parseInt(req.params.id), (error, anime) => {
                    if (anime) {
                        render(anime);
                    }
                })
            }
        })

        function render(anime) {
            anime.availableEp = anime.episodes_aired || anime.episodes;
            let watch = {};
            watch.ep = anime.watched ? anime.watched + 1 : 1;
            if (watch.ep > anime.availableEp) watch.ep = anime.availableEp;
            watch.videoId = null;

            if (req.query.videoId) {
                watch.videoId = req.query.videoId;
            }
            if (req.query.episode) {
                watch.ep = parseInt(req.query.episode);
            }

            online.getPlayers(anime.id, watch.ep, watch.videoId, function(vids) {
                res.render('watch', { anime: anime, watch: watch, videos: vids})
            })
        }
    })
    
    app.post('/api/watched', (req, res) => {
        if (!req.body || !req.body.animeId || !req.body.episode) {
            res.end('fail');
            return;
        }
        let animeId = parseInt(req.body.animeId),
            episode = parseInt(req.body.episode);

        this.emit('watched', { animeId: animeId, episode: episode });
        res.end('ok');
    })

    app.post('/api/note', (req, res) => {
        if (!req.body || !req.body.anime || !req.body.notes) {
            res.end('fail');
            return;
        }
        let animeId = parseInt(req.body.anime),
            noteObj = req.body.notes;
        console.log(noteObj);
        db.anime.set(animeId, { notes: noteObj }, () => {
            this.emit('update-anime', { anime: animeId, field: 'notes', value: noteObj });
            res.end('ok');
        })
    })
    
    SERVER = app.listen(config.get('server.port', 3000), () => {
        console.log('Server on port ' + config.get('server.port', 3000));
        this.active = true;
    })
}

/**
 * Остановить сервер
 */
Server.prototype.stop = function() {
    SERVER.close();
    this.active = false;
}
Server.prototype.app = function() {
    return app;
}



module.exports = new Server();