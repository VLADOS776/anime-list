var __vueify_insert__ = require("vueify/lib/insert-css")
var __vueify_style__ = __vueify_insert__.insert("@charset \"UTF-8\";\n/* line 14, src/scss/_theme.scss */\nbody {\n  background-image: radial-gradient(at top, rgba(255, 255, 255, 0.15), transparent 45%), url(\"img/bg.png\");\n  font-family: 'Futura';\n  color: #d6d6d6;\n  background-repeat: no-repeat, repeat; }\n\n/* line 20, src/scss/_theme.scss */\n.text-primary {\n  color: #FCE397 !important; }\n\n/* line 23, src/scss/_theme.scss */\n.btn-outline-warning {\n  color: #FCE397;\n  border-color: #FCE397; }\n  /* line 26, src/scss/_theme.scss */\n  .btn-outline-warning:hover {\n    background-color: #f9c834; }\n  /* line 29, src/scss/_theme.scss */\n  .btn-outline-warning.disabled {\n    color: #FCE397; }\n    /* line 31, src/scss/_theme.scss */\n    .btn-outline-warning.disabled:hover {\n      color: #fff; }\n\n/* line 36, src/scss/_theme.scss */\n.form-control {\n  background-color: #282C2F;\n  color: #d6d6d6; }\n  /* line 39, src/scss/_theme.scss */\n  .form-control:focus {\n    background-color: #282C2F;\n    color: #d6d6d6;\n    border-color: #FCE397; }\n\n/* line 45, src/scss/_theme.scss */\n.nav-tabs .nav-link {\n  color: #fff; }\n  /* line 47, src/scss/_theme.scss */\n  .nav-tabs .nav-link.active, .nav-tabs .nav-link:hover {\n    background-color: rgba(0, 0, 0, 0.3);\n    color: #FCE397;\n    border-color: transparent;\n    border-bottom: 2px solid #FCE397; }\n  /* line 53, src/scss/_theme.scss */\n  .nav-tabs .nav-link:hover {\n    color: #b3b3b3; }\n\n/* line 58, src/scss/_theme.scss */\nhr {\n  height: 1.5rem;\n  background-image: repeating-linear-gradient(-45deg, rgba(39, 39, 39, 0.45), rgba(39, 39, 39, 0.45) 2px, transparent 2px, transparent 6px);\n  border-top: none; }\n\n/* === Scrollbar === */\n/* line 65, src/scss/_theme.scss */\n::-webkit-scrollbar-thumb {\n  background: #1c1f21;\n  -webkit-border-radius: 4px; }\n\n/* line 70, src/scss/_theme.scss */\n::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 6px #282C2F;\n  background: #3f464b;\n  /* margin: 10px 0; */ }\n\n/* line 76, src/scss/_theme.scss */\n::-webkit-scrollbar {\n  width: 12px; }\n\n/* line 81, src/scss/_theme.scss */\n.fade-enter-active, .fade-leave-active {\n  transition: opacity .5s; }\n\n/* line 84, src/scss/_theme.scss */\n.fade-enter, .fade-leave-to {\n  opacity: 0; }\n\n/* line 88, src/scss/_theme.scss */\n.slide-enter-active, .slide-leave-active {\n  transition: all .5s; }\n\n/* line 91, src/scss/_theme.scss */\n.slide-enter, .slide-leave-to {\n  opacity: 0;\n  position: relative; }\n\n/* line 95, src/scss/_theme.scss */\n.slide-enter {\n  -webkit-transform: translate(0, 10%);\n          transform: translate(0, 10%); }\n\n/* line 98, src/scss/_theme.scss */\n.slide-leave-to {\n  -webkit-transform: translate(0, -10%);\n          transform: translate(0, -10%); }\n\n/* === Loading Spinner === */\n/* line 104, src/scss/_theme.scss */\n.load-spinner {\n  margin: auto;\n  width: 60px;\n  height: 60px;\n  border-width: 5px;\n  border-style: solid;\n  border-color: #FCE397 #282C2F #282C2F;\n  -o-border-image: initial;\n     border-image: initial;\n  box-sizing: border-box;\n  border-radius: 100%;\n  -webkit-animation: circle-spin 1s infinite linear;\n          animation: circle-spin 1s infinite linear; }\n  /* line 116, src/scss/_theme.scss */\n  .load-spinner.center {\n    position: absolute;\n    top: calc(50% - 60px);\n    left: calc(50% - 60px); }\n  /* line 121, src/scss/_theme.scss */\n  .load-spinner.small {\n    width: 30px;\n    height: 30px;\n    border-width: 2px; }\n\n@-webkit-keyframes circle-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n@keyframes circle-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n/* line 1, src/scss/_watch.scss */\n.watch, .watch-style {\n  /* Субтитры у видео */ }\n  /* line 2, src/scss/_watch.scss */\n  .watch .player-contaier, .watch-style .player-contaier {\n    max-height: 625px;\n    position: relative;\n    /*overflow: visible;\r\n        &:after {\r\n            content: '';\r\n            position: absolute;\r\n            z-index: -2;\r\n            box-shadow: 0 26px 15px rgba(0, 0, 0, 0.35);\r\n            bottom: 0;\r\n            left: 10px;\r\n            right: 10px;\r\n            border-radius: 100%;\r\n            height: 20px;\r\n        }*/ }\n  /* line 18, src/scss/_watch.scss */\n  .watch .video-variants, .watch-style .video-variants {\n    padding: 0; }\n    /* line 20, src/scss/_watch.scss */\n    .watch .video-variants .card, .watch-style .video-variants .card {\n      background-color: rgba(0, 0, 0, 0.2); }\n      /* line 23, src/scss/_watch.scss */\n      .watch .video-variants .card .nav-tabs, .watch-style .video-variants .card .nav-tabs {\n        -webkit-box-pack: justify;\n            -ms-flex-pack: justify;\n                justify-content: space-between; }\n        /* line 25, src/scss/_watch.scss */\n        .watch .video-variants .card .nav-tabs .nav-item a, .watch-style .video-variants .card .nav-tabs .nav-item a {\n          color: #fff; }\n          /* line 27, src/scss/_watch.scss */\n          .watch .video-variants .card .nav-tabs .nav-item a.active, .watch .video-variants .card .nav-tabs .nav-item a:hover, .watch-style .video-variants .card .nav-tabs .nav-item a.active, .watch-style .video-variants .card .nav-tabs .nav-item a:hover {\n            color: #FCE397; }\n      /* line 33, src/scss/_watch.scss */\n      .watch .video-variants .card .video-players, .watch-style .video-variants .card .video-players {\n        list-style: none;\n        line-height: 1.4rem;\n        padding: 0;\n        margin: 0;\n        max-height: 312px;\n        overflow-y: auto; }\n        @media (max-width: 1200px) {\n          /* line 33, src/scss/_watch.scss */\n          .watch .video-variants .card .video-players, .watch-style .video-variants .card .video-players {\n            max-height: 243px; } }\n        /* line 45, src/scss/_watch.scss */\n        .watch .video-variants .card .video-players li, .watch-style .video-variants .card .video-players li {\n          padding: 2px;\n          padding-left: 10px;\n          cursor: pointer;\n          font-size: 0.9rem;\n          word-break: break-all; }\n          /* line 51, src/scss/_watch.scss */\n          .watch .video-variants .card .video-players li.active, .watch .video-variants .card .video-players li.selected, .watch-style .video-variants .card .video-players li.active, .watch-style .video-variants .card .video-players li.selected {\n            background-color: #FCE397;\n            color: #282C2F; }\n            /* line 54, src/scss/_watch.scss */\n            .watch .video-variants .card .video-players li.active a, .watch .video-variants .card .video-players li.selected a, .watch-style .video-variants .card .video-players li.active a, .watch-style .video-variants .card .video-players li.selected a {\n              color: #282C2F; }\n          /* line 58, src/scss/_watch.scss */\n          .watch .video-variants .card .video-players li:hover, .watch .video-variants .card .video-players li a:hover, .watch-style .video-variants .card .video-players li:hover, .watch-style .video-variants .card .video-players li a:hover {\n            background-color: #fdf0c9;\n            color: #282C2F;\n            text-decoration: none; }\n          /* line 63, src/scss/_watch.scss */\n          .watch .video-variants .card .video-players li .hosting, .watch-style .video-variants .card .video-players li .hosting {\n            font-size: 0.7rem;\n            color: #828282;\n            white-space: nowrap;\n            text-align: right; }\n          /* line 69, src/scss/_watch.scss */\n          .watch .video-variants .card .video-players li.eng:after, .watch-style .video-variants .card .video-players li.eng:after {\n            content: 'English';\n            margin-right: 5px;\n            font-size: 0.7rem;\n            float: right;\n            vertical-align: middle;\n            color: #97cdfc; }\n          /* line 77, src/scss/_watch.scss */\n          .watch .video-variants .card .video-players li a, .watch-style .video-variants .card .video-players li a {\n            color: #fff;\n            text-decoration: none; }\n        /* line 83, src/scss/_watch.scss */\n        .watch .video-variants .card .video-players::-webkit-scrollbar-thumb, .watch-style .video-variants .card .video-players::-webkit-scrollbar-thumb {\n          background: #FCE397;\n          -webkit-border-radius: 10px; }\n        /* line 88, src/scss/_watch.scss */\n        .watch .video-variants .card .video-players::-webkit-scrollbar-track, .watch-style .video-variants .card .video-players::-webkit-scrollbar-track {\n          -webkit-box-shadow: inset 0 0 6px #a7a7a7;\n          -webkit-border-radius: 10px;\n          /* margin: 10px 0; */ }\n        /* line 94, src/scss/_watch.scss */\n        .watch .video-variants .card .video-players::-webkit-scrollbar, .watch-style .video-variants .card .video-players::-webkit-scrollbar {\n          width: 5px; }\n  /* line 101, src/scss/_watch.scss */\n  .watch #select-ep, .watch-style #select-ep {\n    margin-top: 1rem; }\n  /* line 107, src/scss/_watch.scss */\n  .watch ::cue, .watch-style ::cue {\n    background: transparent;\n    text-shadow: #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px;\n    font-family: Tahoma;\n    font-weight: bold; }\n")





































































































































































































































































































































































module.exports = {
    data() {
        return {
            videos: null,
            loading: false,
            loadingVideo: false,
            local: false,
            localFile: null,
            epRegEx: /[-._ \[]+(?:[ _.-]*(?:ep?[ .]?)?(\d{1,3})(?:[_ ]?v\d+)?)+/i,
            config: config
        }
    },
    props: ['watch', 'anime'],
    computed: {
        videoEmbed: function() {
            if (this.videos.player && this.videos.player.embed) {
                if (this.videos.player.embed.startsWith('//')) {
                    return 'http:' + this.videos.player.embed
                } else {
                    return this.videos.player.embed
                }
            }
        }
    },
    watch: {
        'watch.ep': function(val) {
            if (!this.local && val) {
                this.watch.video_id = null;
                this.loadPlayer();
            }
        },
        'loadingVideo': function() {
            this.removeAdInIframe();
        },
        'local': function() {
            if (!this.local) {
                this.localFile = null;
            }
        },
        'localFile': function(newVal) {
            if (newVal && newVal.episode) {
                this.watch.ep = newVal.episode

                // Ищем субтитры для локального файла
                let subs = subtitles.searchSubForEp({ path: this.anime.folder, episode: newVal.episode })

                // Если сабов нет в текущей папке, ищем отдельную папку с сабами
                if (!subs.length) {
                    let subFolders = subtitles.findSubFolder({ path: this.anime.folder });
                    if (subFolders.length) {
                        subFolders.forEach(folder => {
                            let tmp = subtitles.searchSubForEp({ path: this.anime.folder + '/' + folder, episode: newVal.episode })
                            if (tmp.length) {
                                subs = tmp;
                            }
                        })
                    }
                }

                if (subs && subs.length) {
                    // Берем только первые сабы
                    let firstSub = subs[0];

                    if (firstSub.format !== 'vtt') {
                        subtitles.convert({ file: firstSub.path }, (error, converted) => {
                            if (error) console.error(error);
                            if (converted) {
                                this.addSubtitles(converted, true);
                                this.$set(this.localFile, 'subs', converted);
                            }
                        })
                    }
                }
            }
        }
    },
    methods: {
        loadPlayer: function(videoOnly=false) {
            let sendObj = {
                anime: this.anime,
                watch: this.watch,
                videos: this.videos,
                videoOnly: false
            }
            if (!videoOnly) {
                this.loading = true;
            } else {
                this.loadingVideo = true;
                sendObj.videoOnly = true;
            }

            Sources.watch(sendObj, (watchObj, err) => {
                if (err || !watchObj) {
                    PluginEvent({ type: 'error', error: err, watch: this.watch})
                } else {
                    this.videos = watchObj;
                    this.loading = false;
                    this.loadingVideo = false;
                    PluginEvent({ type: 'watch', watch: this.watch })
                }
            });
            // Загрузить всё
            /*let self = this;
            if (!videoOnly) {
                this.loading = true;
                if (this.anime.id == null) {
                    log.error('Animeid is null');
                    return;
                }

                online.getPlayers(this.anime.id, this.watch.ep, this.watch.videoId, function(vids) {
                    if (typeof vids === 'number') {
                        PluginEvent({ type: 'error', error: { msg: 'Not found', code: 404 }, watch: self.watch })
                    } else {
                        self.videos = vids;
                        self.loading = false;
                        PluginEvent({ type: 'watch', watch: self.watch })
                    }
                })
            } else {
                // Загрузить только видео
                this.loadingVideo = true;
                
                online.getPlayers(this.anime.id, this.watch.ep, this.watch.videoId, function(vids) {
                    if (typeof vids === 'number') {
                        PluginEvent({ type: 'error', error: { msg: 'Not found', code: 404 }, watch: self.watch })
                    } else {
                        self.videos.player = vids.player;
                        self.loadingVideo = false;
                        PluginEvent({ type: 'watch', watch: self.watch })
                    }
                })
            }*/
        },
        back: function() {
            this.$emit('change_page', 'anime')
        },
        prevEp: function() {
            if (this.watch.ep > 1) {
                this.watch.ep--;

                ga.event('Watch controls', 'Prev ep', { evLabel: this.anime.name + ' - ' + this.watch.ep, clientID: clientID });
            }
        },
        nextEp: function() {
            if (this.watch.ep < this.anime.episodes_aired || this.anime.episodes) {
                this.watch.ep++;

                ga.event('Watch controls', 'Next ep', { evLabel: this.anime.name + ' - ' + this.watch.ep, clientID: clientID });
            }
        },
        markAsWatched: function() {
            if (!this.anime.inDB) {
                let self = this;
                db.anime.add(JSON.parse(JSON.stringify(this.anime)), function() {
                    db.anime.watchEp(self.anime, self.watch.ep);
                    self.$root.$emit('update-all-anime');

                    PluginEvent({ type: 'markAsWatched', watch: self.watch })

                    ga.event('Watch controls', 'Mark as watched', { evLabel: self.anime.name + ' - ' + self.watch.ep, clientID: clientID });
                })
            } else {
                let mark = this.watch.ep;
                if (this.watch.ep < this.anime.watched) {
                    mark--;
                }
                db.anime.watchEp(this.anime, mark);
                this.$set(this.anime, 'watched', mark);

                PluginEvent({ type: 'markAsWatched', watch: this.watch });

                ga.event('Watch controls', 'Mark as unwatched', { evLabel: this.anime.name + ' - ' + this.watch.ep, clientID: clientID });
            }
        },
        change_videoId: function(video_id) {
            this.watch.video_id = video_id;
            this.loadPlayer(true);

            PluginEvent({ type: 'changeVideo', watch: this.watch })
        },
        localToggle: function() {
            this.local = !this.local;
        },
        addSubtitles: function(subs, empty) {
            if (empty) $('#localPlayer').empty();

            let track = document.createElement('track');
            track.kind = 'subtitles';
            track.label = subs.name;
            track.srclang = 'ru';
            track.src = subs.url;
            track.addEventListener('load', function() {
                this.mode = 'showing';
            })
            $('#localPlayer').append(track);
            document.getElementById('localPlayer').textTracks[0].mode = 'showing';
        },
        removeAdInIframe: function() {
            /*try {
                let iframe = document.querySelector('iframe#player');
                iframe.onload = function() {
                    online.removeAd();
                    console.log('Ad in iframe removed');
                }    
            } catch (error) {}*/
        },
        note: function() {
            db.anime.set(this.anime, { notes: this.anime.notes });

            PluginEvent({ type: 'addNote', notes: this.anime.notes, watch: this.watch })
        }
    },
    mounted: function() {
        this.$nextTick(() => this.removeAdInIframe());
    },
    created: function() {
        log.info('Watch screen created!');
        this.loadPlayer()

        if (this.anime.folder) {
            try {
                let files = fs.readdirSync(this.anime.folder).sort();

                if (files && files.length) {
                    let subFound = false;

                    let localFiles = files
                        .filter(file => {
                            return file.match(/\.\w{3}$/)
                        })
                        .map(file => {
                            let tmp = file.match(this.epRegEx),
                                ep = null;

                            if (tmp && tmp.length) {
                                ep = parseInt(tmp[1]);
                            }

                            let path = this.anime.folder.replace(/\\/g, '/') + '/' + file;
                            let format = file.match(/\.(\w{3})$/)[1]
                            let name = file.replace(/\.\w{3}/, '');

                            return {
                                name: name,
                                path: path,
                                format: format,
                                url: 'file:///' + path,
                                episode: ep
                            }

                        })
                    
                    this.$set(this.anime, 'localFiles', localFiles);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"watch\">\n    <div class=\"load-spinner\" v-if=\"loading\"></div>\n    <div v-else=\"\">\n        <div class=\"d-flex mb-2 justify-content-between\">\n            <div>\n                <button class=\"btn btn-outline-secondary btn-sm\" @click=\"back\"><i class=\"fa fa-arrow-left\" aria-hidden=\"true\"></i> Назад</button>\n            </div>\n            <div class=\"btn-group\" data-toggle=\"buttons\" v-if=\"anime.localFiles\">\n                <label class=\"btn btn-secondary\" :class=\"{active: !local}\" @click=\"localToggle\">\n                    <input type=\"radio\" name=\"watchType\" id=\"online\" :cheked=\"!local\"> Онлайн просмотр\n                </label>\n                <label class=\"btn btn-secondary\" :class=\"{active: local}\" @click=\"localToggle\">\n                    <input type=\"radio\" name=\"watchType\" id=\"offline\" :cheked=\"local\"> Локальные файлы\n                </label>\n            </div>\n        </div>\n        <h3 class=\"mb-2\">{{ anime.russian }} [{{ watch.ep }} / {{ anime.episodes_aired || anime.episodes }}]</h3>\n        <div class=\"row\">\n            <div class=\"col-lg-8 mb-3\">\n                <div class=\"player-contaier embed-responsive embed-responsive-16by9\">\n                    \n                    <video :src=\"localFile.url\" class=\"embed-responsive-item\" v-if=\"localFile\" controls=\"\" id=\"localPlayer\">\n                        <!-- <track label=\"Russian\" kind=\"subtitles\" srclang=\"ru\" :src=\"localFile.subs.url\" default v-if='localFile.subs'> -->\n                    </video>\n                    <iframe :src=\"videoEmbed\" frameborder=\"0\" id=\"player\" class=\"embed-responsive-item\" v-else-if=\"!loadingVideo\" allowfullscreen=\"\"></iframe>\n                    <div class=\"load-spinner center\" v-else=\"\"></div>\n                </div>\n            </div>\n\n            <!-- Онлайн просмотр -->\n            <div class=\"col-lg-4 video-variants\" v-if=\"!local\">\n                <b-card no-body=\"\">\n                    <b-tabs ref=\"tabs\">\n                        <b-tab title=\"Озвучка\" v-if=\"videos.fandub &amp;&amp; videos.fandub.length\" active=\"\">\n                            <ul class=\"video-players fandub\">\n                                <li v-for=\"video in videos.fandub\" :key=\"video.video_id\" v-if=\"video.author &amp;&amp; video.author.length\" :class=\"{active: video.video_id === videos.player.video_id}\" @click=\"change_videoId(video.video_id)\" class=\"d-flex justify-content-between\">\n                                    <span>{{ video.author || watch.ep + ' серия' }}</span><span class=\"hosting\">{{ video.hosting }}</span>\n                                </li>\n                            </ul>\n                        </b-tab>\n                        <b-tab title=\"Субтитры\" v-if=\"videos.sub &amp;&amp; videos.sub.length\">\n                            <ul class=\"video-players sub\">\n                                <li v-for=\"video in videos.sub\" :key=\"video.video_id\" v-if=\"video.author &amp;&amp; video.author.length\" :class=\"{active: video.video_id === videos.player.video_id, eng: video.kindClass &amp;&amp; video.kindClass.indexOf('english') !== -1}\" @click=\"change_videoId(video.video_id)\" class=\"d-flex justify-content-between\">\n                                    <span>{{ video.author || watch.ep + ' серия' }}</span><span class=\"hosting\">{{ video.hosting }}</span>\n                                </li>\n                            </ul>\n                        </b-tab>\n                        <b-tab title=\"Оригинал\" v-if=\"videos.raw &amp;&amp; videos.raw.length\">\n                            <ul class=\"video-players raw\">\n                                <li v-for=\"video in videos.raw\" :key=\"video.video_id\" v-if=\"video.author &amp;&amp; video.author.length\" :class=\"{active: video.video_id === videos.player.video_id}\" @click=\"change_videoId(video.video_id)\" class=\"d-flex justify-content-between\">\n                                    <span>{{ video.author || watch.ep + ' серия' }}</span><span class=\"hosting\">{{ video.hosting }}</span>\n                                </li>\n                            </ul>\n                        </b-tab>\n                    </b-tabs>\n                </b-card>\n                <select id=\"select-ep\" class=\"form-control\" v-model=\"watch.ep\">\n                    <option v-for=\"epNum in anime.episodes_aired\" :value=\"epNum\" @click=\"watch.video_id=null\" :key=\"epNum\">{{epNum}} серия</option>\n                </select>\n            </div>\n\n            <!-- Локальные файлы в папке -->\n            <div class=\"col-lg-4 video-variants\" v-else=\"\">\n                <b-card no-body=\"\">\n                    <b-tabs ref=\"tabs\">\n                        <b-tab title=\"Файлы в папке\" active=\"\">\n                            <ul class=\"video-players local\">\n                                <li v-for=\"file in anime.localFiles\" class=\"d-flex justify-content-between\" :key=\"file.name\" :class=\"{active: file == localFile}\" @click=\"localFile = file\">\n                                    <span>{{file.name}}</span>\n                                </li>\n                            </ul>\n                        </b-tab>\n                    </b-tabs>\n                </b-card>\n            </div>\n        </div>\n        <div class=\"d-flex justify-content-between mt-3\">\n            <button class=\"btn btn-outline-warning\" :class=\"{disabled: watch.ep === 1}\" @click=\"prevEp\"><i class=\"fa fa-arrow-left\" aria-hidden=\"true\"></i> Предыдущая серия</button>\n            <button class=\"btn\" :class=\"{'btn-outline-info': !anime.watched || watch.ep > anime.watched, 'btn-info': watch.ep <= anime.watched}\" @click=\"markAsWatched\"><i class=\"fa fa-check\" aria-hidden=\"true\"></i> Просмотрено</button>\n            <button class=\"btn btn-outline-warning\" :class=\"{disabled: watch.ep === (anime.episodes_aired || anime.episodes)}\" @click=\"nextEp\"><i class=\"fa fa-arrow-right\" aria-hidden=\"true\"></i> Следующая серия</button>\n        </div>\n        <div class=\"mt-3 mb-3 note\" v-if=\"config.get('anime.showNotes', true)\">\n            <textarea name=\"note\" id=\"note\" cols=\"30\" rows=\"3\" placeholder=\"Заметка о серии\" class=\"form-control\" v-model.lazy=\"anime.notes[watch.ep]\" @change=\"note\"></textarea>\n        </div>\n    </div>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.dispose(function () {
    __vueify_insert__.cache["@charset \"UTF-8\";\n/* line 14, src/scss/_theme.scss */\nbody {\n  background-image: radial-gradient(at top, rgba(255, 255, 255, 0.15), transparent 45%), url(\"img/bg.png\");\n  font-family: 'Futura';\n  color: #d6d6d6;\n  background-repeat: no-repeat, repeat; }\n\n/* line 20, src/scss/_theme.scss */\n.text-primary {\n  color: #FCE397 !important; }\n\n/* line 23, src/scss/_theme.scss */\n.btn-outline-warning {\n  color: #FCE397;\n  border-color: #FCE397; }\n  /* line 26, src/scss/_theme.scss */\n  .btn-outline-warning:hover {\n    background-color: #f9c834; }\n  /* line 29, src/scss/_theme.scss */\n  .btn-outline-warning.disabled {\n    color: #FCE397; }\n    /* line 31, src/scss/_theme.scss */\n    .btn-outline-warning.disabled:hover {\n      color: #fff; }\n\n/* line 36, src/scss/_theme.scss */\n.form-control {\n  background-color: #282C2F;\n  color: #d6d6d6; }\n  /* line 39, src/scss/_theme.scss */\n  .form-control:focus {\n    background-color: #282C2F;\n    color: #d6d6d6;\n    border-color: #FCE397; }\n\n/* line 45, src/scss/_theme.scss */\n.nav-tabs .nav-link {\n  color: #fff; }\n  /* line 47, src/scss/_theme.scss */\n  .nav-tabs .nav-link.active, .nav-tabs .nav-link:hover {\n    background-color: rgba(0, 0, 0, 0.3);\n    color: #FCE397;\n    border-color: transparent;\n    border-bottom: 2px solid #FCE397; }\n  /* line 53, src/scss/_theme.scss */\n  .nav-tabs .nav-link:hover {\n    color: #b3b3b3; }\n\n/* line 58, src/scss/_theme.scss */\nhr {\n  height: 1.5rem;\n  background-image: repeating-linear-gradient(-45deg, rgba(39, 39, 39, 0.45), rgba(39, 39, 39, 0.45) 2px, transparent 2px, transparent 6px);\n  border-top: none; }\n\n/* === Scrollbar === */\n/* line 65, src/scss/_theme.scss */\n::-webkit-scrollbar-thumb {\n  background: #1c1f21;\n  -webkit-border-radius: 4px; }\n\n/* line 70, src/scss/_theme.scss */\n::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 6px #282C2F;\n  background: #3f464b;\n  /* margin: 10px 0; */ }\n\n/* line 76, src/scss/_theme.scss */\n::-webkit-scrollbar {\n  width: 12px; }\n\n/* line 81, src/scss/_theme.scss */\n.fade-enter-active, .fade-leave-active {\n  transition: opacity .5s; }\n\n/* line 84, src/scss/_theme.scss */\n.fade-enter, .fade-leave-to {\n  opacity: 0; }\n\n/* line 88, src/scss/_theme.scss */\n.slide-enter-active, .slide-leave-active {\n  transition: all .5s; }\n\n/* line 91, src/scss/_theme.scss */\n.slide-enter, .slide-leave-to {\n  opacity: 0;\n  position: relative; }\n\n/* line 95, src/scss/_theme.scss */\n.slide-enter {\n  -webkit-transform: translate(0, 10%);\n          transform: translate(0, 10%); }\n\n/* line 98, src/scss/_theme.scss */\n.slide-leave-to {\n  -webkit-transform: translate(0, -10%);\n          transform: translate(0, -10%); }\n\n/* === Loading Spinner === */\n/* line 104, src/scss/_theme.scss */\n.load-spinner {\n  margin: auto;\n  width: 60px;\n  height: 60px;\n  border-width: 5px;\n  border-style: solid;\n  border-color: #FCE397 #282C2F #282C2F;\n  -o-border-image: initial;\n     border-image: initial;\n  box-sizing: border-box;\n  border-radius: 100%;\n  -webkit-animation: circle-spin 1s infinite linear;\n          animation: circle-spin 1s infinite linear; }\n  /* line 116, src/scss/_theme.scss */\n  .load-spinner.center {\n    position: absolute;\n    top: calc(50% - 60px);\n    left: calc(50% - 60px); }\n  /* line 121, src/scss/_theme.scss */\n  .load-spinner.small {\n    width: 30px;\n    height: 30px;\n    border-width: 2px; }\n\n@-webkit-keyframes circle-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n@keyframes circle-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n/* line 1, src/scss/_watch.scss */\n.watch, .watch-style {\n  /* Субтитры у видео */ }\n  /* line 2, src/scss/_watch.scss */\n  .watch .player-contaier, .watch-style .player-contaier {\n    max-height: 625px;\n    position: relative;\n    /*overflow: visible;\r\n        &:after {\r\n            content: '';\r\n            position: absolute;\r\n            z-index: -2;\r\n            box-shadow: 0 26px 15px rgba(0, 0, 0, 0.35);\r\n            bottom: 0;\r\n            left: 10px;\r\n            right: 10px;\r\n            border-radius: 100%;\r\n            height: 20px;\r\n        }*/ }\n  /* line 18, src/scss/_watch.scss */\n  .watch .video-variants, .watch-style .video-variants {\n    padding: 0; }\n    /* line 20, src/scss/_watch.scss */\n    .watch .video-variants .card, .watch-style .video-variants .card {\n      background-color: rgba(0, 0, 0, 0.2); }\n      /* line 23, src/scss/_watch.scss */\n      .watch .video-variants .card .nav-tabs, .watch-style .video-variants .card .nav-tabs {\n        -webkit-box-pack: justify;\n            -ms-flex-pack: justify;\n                justify-content: space-between; }\n        /* line 25, src/scss/_watch.scss */\n        .watch .video-variants .card .nav-tabs .nav-item a, .watch-style .video-variants .card .nav-tabs .nav-item a {\n          color: #fff; }\n          /* line 27, src/scss/_watch.scss */\n          .watch .video-variants .card .nav-tabs .nav-item a.active, .watch .video-variants .card .nav-tabs .nav-item a:hover, .watch-style .video-variants .card .nav-tabs .nav-item a.active, .watch-style .video-variants .card .nav-tabs .nav-item a:hover {\n            color: #FCE397; }\n      /* line 33, src/scss/_watch.scss */\n      .watch .video-variants .card .video-players, .watch-style .video-variants .card .video-players {\n        list-style: none;\n        line-height: 1.4rem;\n        padding: 0;\n        margin: 0;\n        max-height: 312px;\n        overflow-y: auto; }\n        @media (max-width: 1200px) {\n          /* line 33, src/scss/_watch.scss */\n          .watch .video-variants .card .video-players, .watch-style .video-variants .card .video-players {\n            max-height: 243px; } }\n        /* line 45, src/scss/_watch.scss */\n        .watch .video-variants .card .video-players li, .watch-style .video-variants .card .video-players li {\n          padding: 2px;\n          padding-left: 10px;\n          cursor: pointer;\n          font-size: 0.9rem;\n          word-break: break-all; }\n          /* line 51, src/scss/_watch.scss */\n          .watch .video-variants .card .video-players li.active, .watch .video-variants .card .video-players li.selected, .watch-style .video-variants .card .video-players li.active, .watch-style .video-variants .card .video-players li.selected {\n            background-color: #FCE397;\n            color: #282C2F; }\n            /* line 54, src/scss/_watch.scss */\n            .watch .video-variants .card .video-players li.active a, .watch .video-variants .card .video-players li.selected a, .watch-style .video-variants .card .video-players li.active a, .watch-style .video-variants .card .video-players li.selected a {\n              color: #282C2F; }\n          /* line 58, src/scss/_watch.scss */\n          .watch .video-variants .card .video-players li:hover, .watch .video-variants .card .video-players li a:hover, .watch-style .video-variants .card .video-players li:hover, .watch-style .video-variants .card .video-players li a:hover {\n            background-color: #fdf0c9;\n            color: #282C2F;\n            text-decoration: none; }\n          /* line 63, src/scss/_watch.scss */\n          .watch .video-variants .card .video-players li .hosting, .watch-style .video-variants .card .video-players li .hosting {\n            font-size: 0.7rem;\n            color: #828282;\n            white-space: nowrap;\n            text-align: right; }\n          /* line 69, src/scss/_watch.scss */\n          .watch .video-variants .card .video-players li.eng:after, .watch-style .video-variants .card .video-players li.eng:after {\n            content: 'English';\n            margin-right: 5px;\n            font-size: 0.7rem;\n            float: right;\n            vertical-align: middle;\n            color: #97cdfc; }\n          /* line 77, src/scss/_watch.scss */\n          .watch .video-variants .card .video-players li a, .watch-style .video-variants .card .video-players li a {\n            color: #fff;\n            text-decoration: none; }\n        /* line 83, src/scss/_watch.scss */\n        .watch .video-variants .card .video-players::-webkit-scrollbar-thumb, .watch-style .video-variants .card .video-players::-webkit-scrollbar-thumb {\n          background: #FCE397;\n          -webkit-border-radius: 10px; }\n        /* line 88, src/scss/_watch.scss */\n        .watch .video-variants .card .video-players::-webkit-scrollbar-track, .watch-style .video-variants .card .video-players::-webkit-scrollbar-track {\n          -webkit-box-shadow: inset 0 0 6px #a7a7a7;\n          -webkit-border-radius: 10px;\n          /* margin: 10px 0; */ }\n        /* line 94, src/scss/_watch.scss */\n        .watch .video-variants .card .video-players::-webkit-scrollbar, .watch-style .video-variants .card .video-players::-webkit-scrollbar {\n          width: 5px; }\n  /* line 101, src/scss/_watch.scss */\n  .watch #select-ep, .watch-style #select-ep {\n    margin-top: 1rem; }\n  /* line 107, src/scss/_watch.scss */\n  .watch ::cue, .watch-style ::cue {\n    background: transparent;\n    text-shadow: #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px, #000 0px 0px 2px;\n    font-family: Tahoma;\n    font-weight: bold; }\n"] = false
    document.head.removeChild(__vueify_style__)
  })
  if (!module.hot.data) {
    hotAPI.createRecord("_v-77dbdc4e", module.exports)
  } else {
    hotAPI.update("_v-77dbdc4e", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}