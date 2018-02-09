<template>
    <div class="watch">
        <div class='load-spinner' v-if="loading"></div>
        <div v-else>
            <div class="d-flex mb-2 justify-content-between">
                <div>
                    <button class="btn btn-outline-secondary btn-sm" @click="back"><i class="fa fa-arrow-left" aria-hidden="true"></i> Назад</button>
                </div>
                <div class="btn-group" data-toggle='buttons' v-if='anime.localFiles'>
                    <label class="btn btn-secondary" :class='{active: !local}' @click='localToggle'>
                        <input type="radio" name='watchType' id='online' :cheked='!local'> Онлайн просмотр
                    </label>
                    <label class="btn btn-secondary" :class='{active: local}' @click='localToggle'>
                        <input type="radio" name='watchType' id='offline' :cheked='local'> Локальные файлы
                    </label>
                </div>
            </div>
            <h3 class="mb-2">{{ anime.russian }} [{{ watch.ep }} / {{ anime.episodes_aired || anime.episodes }}]</h3>
            <div class="row">
                <div class="col-lg-8 mb-3">
                    <div class="player-contaier embed-responsive embed-responsive-16by9">
                        
                        <video :src="localFile.url" class='embed-responsive-item' v-if='localFile' controls id='localPlayer'>
                            <!-- <track label="Russian" kind="subtitles" srclang="ru" :src="localFile.subs.url" default v-if='localFile.subs'> -->
                        </video>
                        <iframe :src="videoEmbed" frameborder="0" id="player" class='embed-responsive-item' v-else-if="!loadingVideo" allowfullscreen></iframe>
                        <div class='load-spinner center' v-else></div>
                    </div>
                </div>

                <!-- Онлайн просмотр -->
                <div class="col-lg-4 video-variants" v-if='!local'>
                    <b-card no-body>
                        <b-tabs ref="tabs">
                            <b-tab title="Озвучка"  v-if='videos.fandub && videos.fandub.length' active>
                                <ul class="video-players fandub">
                                    <li v-for="video in videos.fandub" v-if="video.author && video.author.length" :class="{active: video.video_id === videos.player.video_id}" @click="change_videoId(video.video_id)" class="d-flex justify-content-between">
                                        <span>{{ video.author || watch.ep + ' серия' }}</span><span class="hosting">{{ video.hosting }}</span>
                                    </li>
                                </ul>
                            </b-tab>
                            <b-tab title="Субтитры" v-if='videos.sub && videos.sub.length'>
                                <ul class="video-players sub">
                                    <li v-for="video in videos.sub" v-if="video.author && video.author.length" :class="{active: video.video_id === videos.player.video_id, eng: video.kindClass && video.kindClass.indexOf('english') !== -1}" @click="change_videoId(video.video_id)" class="d-flex justify-content-between">
                                        <span>{{ video.author || watch.ep + ' серия' }}</span><span class="hosting">{{ video.hosting }}</span>
                                    </li>
                                </ul>
                            </b-tab>
                            <b-tab title="Оригинал" v-if='videos.raw && videos.raw.length'>
                                <ul class="video-players raw">
                                    <li v-for="video in videos.raw" v-if="video.author && video.author.length" :class="{active: video.video_id === videos.player.video_id}" @click="change_videoId(video.video_id)" class="d-flex justify-content-between">
                                        <span>{{ video.author || watch.ep + ' серия' }}</span><span class="hosting">{{ video.hosting }}</span>
                                    </li>
                                </ul>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                    <select id="select-ep" class="form-control" v-model="watch.ep">
                        <option v-for="epNum in anime.episodes_aired" :value="epNum" @click="watch.video_id=null">{{epNum}} серия</option>
                    </select>
                </div>

                <!-- Локальные файлы в папке -->
                <div class="col-lg-4 video-variants" v-else>
                    <b-card no-body>
                        <b-tabs ref='tabs'>
                            <b-tab title='Файлы в папке' active>
                                <ul class="video-players local">
                                    <li v-for="file in anime.localFiles" class="d-flex justify-content-between" :class='{active: file == localFile}' @click='localFile = file'>
                                        <span>{{file.name}}</span>
                                    </li>
                                </ul>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                </div>
            </div>
            <div class="d-flex justify-content-between mt-3">
                <button class="btn btn-outline-warning" :class="{disabled: watch.ep === 1}" @click="prevEp"><i class="fa fa-arrow-left" aria-hidden="true"></i> Предыдущая серия</button>
                <button class="btn" :class="{'btn-outline-info': !anime.watched || watch.ep > anime.watched, 'btn-info': watch.ep <= anime.watched}" @click="markAsWatched"><i class="fa fa-check" aria-hidden="true"></i> Просмотрено</button>
                <button class="btn btn-outline-warning" :class="{disabled: watch.ep === (anime.episodes_aired || anime.episodes)}" @click="nextEp"><i class="fa fa-arrow-right" aria-hidden="true"></i> Следующая серия</button>
            </div>
            <div class="mt-3 mb-3 note" v-if="config.get('anime.showNotes', true)">
                <textarea name="note" id="note" cols="30" rows="3" placeholder="Заметка о серии" class='form-control' v-model.lazy='anime.notes[watch.ep]' @change='note'></textarea>
            </div>
        </div>
    </div>
</template>

<script>
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
</script>

<style lang="scss" scoped>
    @import "../scss/_theme";

    .watch, .watch-style {
        .player-contaier {
            max-height: 625px;
            position: relative;
            /*overflow: visible;
            &:after {
                content: '';
                position: absolute;
                z-index: -2;
                box-shadow: 0 26px 15px rgba(0, 0, 0, 0.35);
                bottom: 0;
                left: 10px;
                right: 10px;
                border-radius: 100%;
                height: 20px;
            }*/
        }
        .video-variants {
            padding: 0;
            .card {
                background-color: $bgTransparent;;
                
                .nav-tabs {
                    justify-content: space-between;
                    .nav-item a {
                        color: #fff;
                        &.active, &:hover {
                            color: $primaryColor;
                        }
                    }
                }
                
                .video-players {
                    list-style: none;
                    line-height: 1.4rem;
                    padding: 0;
                    margin: 0;
                    max-height: 312px;
                    overflow-y: auto;
                    
                    @media (max-width: 1200px) {
                        max-height: 243px;
                    }

                    li {
                        padding: 2px;
                        padding-left: 10px;
                        cursor: pointer;
                        font-size: 0.9rem;
                        word-break: break-all;
                        &.active, &.selected {
                            background-color: $primaryColor;
                            color: $dark;
                            a {
                                color: $dark;
                            }
                        }
                        &:hover, a:hover {
                            background-color: lighten($primaryColor, 10);
                            color: $dark;
                            text-decoration: none;
                        }
                        .hosting {
                            font-size: 0.7rem;
                            color: #828282;
                            white-space: nowrap;
                            text-align: right;
                        }
                        &.eng:after {
                            content: 'English';
                            margin-right: 5px;
                            font-size: 0.7rem;
                            float: right;
                            vertical-align: middle;
                            color: #97cdfc;
                        }
                        a {
                            color: #fff;
                            text-decoration: none;
                        }
                    }
                    
                    &::-webkit-scrollbar-thumb {
                        background: $primaryColor;
                        -webkit-border-radius: 10px;
                    }

                    &::-webkit-scrollbar-track {
                        -webkit-box-shadow: inset 0 0 6px #a7a7a7;
                        -webkit-border-radius: 10px;
                        /* margin: 10px 0; */
                    }

                    &::-webkit-scrollbar {
                        width: 5px;
                    }

                }
            }
        }
        #select-ep {
            margin-top: 1rem;
        }

        /* Субтитры у видео */
        $stroke: 2px;
        ::cue {
            background: transparent;
            text-shadow: #000 0px 0px $stroke,   #000 0px 0px $stroke,   #000 0px 0px $stroke,
            #000 0px 0px $stroke,   #000 0px 0px $stroke,   #000 0px 0px $stroke;
            font-family: Tahoma;
            font-weight: bold;
        }
    }
</style>
