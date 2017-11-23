var $ = jQuery = require('./js/libs/jquery-3.2.1.min.js'),
    bootstrap = require('./js/libs/bootstrap.min.js');

var remote = require('electron').remote,
    {dialog} = require('electron').remote,
    {ipcRenderer} = require('electron'),
    fs = require('fs'),
    path = require('path'),
    compareVersions = require('compare-versions');

var Vue = require('./js/libs/vue.js'),
    db = require('./js/db.js'),
    online = require('./js/online'),
    shikimori = require('./js/shikimoriInfo'),
    {anime: animeInfo, manga: mangaInfo} = require('./js/shikimoriInfo'),
    subtitles = require('./js/subtitles'),
    repos = require('./js/repos'),
    Fuse = require('./js/libs/fuse');

var onlineManga = require('./js/onlineManga.js');

const log = require('./js/log'),
      config = require('./js/config'),
      miner = require('./miner'),
      Plugins = require('./plugin'),
      Sources = require('./sources'),
      emitter = require('./emitter');

const server = require('./server');

const Analytics = require('electron-google-analytics').default;
const ga = new Analytics('UA-26654861-22');
const clientID = require("os").userInfo().username;

//var anime = require('animejs');

var DEV = true;

server.on('watched', function(data) {
    let anime = app.allAnime.find((anime) => {
        if (data.query.id) {
            return anime.id === data.query.id
        } else if (data.query.name && data.query.source) {
            return anime.name == data.query.name && anime.source == data.query.source
        }
    });
    
    if (anime) {
        anime.watched = data.episode;
        db.anime.watchEp(anime, data.episode);
    } else if (data.query.id) {
        animeInfo.info(data.query.id, (error, anime) => {
            if (anime) {
                db.anime.add(anime, () => {
                    db.anime.watchEp(anime, data.episode);
                    app.$emit('update-all-anime');
                })
            }
        })
    }
})

ipcRenderer.on('adblock', (event, arg) => {
    console.warn(`Ad blocked!`, arg);
})

/* === TODO LIST ===
** TODO: Логин на shikimori и импорт списков.
** TODO: Собирать информацию с разных источников. Для сверки использовать название и год выпуска.
*/
var Mixins = {
    browser: {
        methods: {
            browser: function(url) {
                require('electron').shell.openExternal(url);
            }
        }
    },
    cleanDescr: {
        methods: {
            cleanDescr: function() {
                let descr = this.anime && this.anime.description ? this.anime.description :
                            this.manga && this.manga.description ? this.manga.description :
                            '';
                if (descr) {
                    return descr.replace(/\[\/?character.*?\]/gi, '')
                            .replace(/\r\n/gi, '<br>')
                            .replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>')
                            .replace(/\[\[|\]\]/g, '')
                } else {
                    return ''
                }
            }
        }
    },
    selectItem: {
        methods: {
            select_anime: function(anime) {
                this.$root.$emit('anime', anime)
            },
            select_manga: function(manga) {
                this.$root.$emit('manga', manga)
            },
        }
    },
    pluginsCategories: {
        computed: {
            allCat: function() {
                let tmp = [];
                Plugins.getAllPlugins().forEach(plug => {
                    if (Array.isArray(plug.opt.category)) {
                        plug.opt.category.forEach(category => {
                            if (!tmp.includes(category)) {
                                tmp.push(category)
                            }
                        })
                    }
                });
                return tmp;
            }
        }
    }
}

Vue.use(require('./js/libs/bootstrap-vue.js'));
Vue.use(require('vue-scrollto'));
Vue.use(require('./js/libs/vue-shortkey.js'), { prevent: ['input', 'textarea'] });

function getTemplate(name) {
    return fs.readFileSync(path.join(__dirname, 'templates', name + '.html'), 'utf-8')
}

Vue.component('start', {
    template: getTemplate('start'),
    props: ['all_anime'],
    mixins: [Mixins.selectItem],
    data: function() {
        return {
            selectedHorizontal: null,
            droppedTime: 1000 * 60 * 60 * 24 * 18, // 2.5 weeks
            dropdownHorizontal: [
                { 
                    name: 'Смотрю',
                    filter: (anime) => {
                        if (anime.watched < (anime.episodes_aired || anime.episodes)) {
                            if (anime.lastWatched && Date.now() - anime.lastWatched > this.droppedTime) {
                                return false
                            }
                            return true;
                        }
                        return false;
                    },
                    sort: (a, b) => {
                        return a.lastWatched && b.lastWatched ? b.lastWatched - a.lastWatched : 
                               a.lastWatched ? -1 :
                               b.lastWatched ? 1 :
                               0
                    },
                    //limit: 10
                },
                { 
                    name: 'Хочу посмотреть',
                    filter: function(anime) {
                        return !anime.watched
                    },
                    sort: function(a, b) {
                        return a.lastWatched && b.lastWatched ? b.lastWatched - a.lastWatched :
                               a.lastWatched ? -1 :
                               b.lastWatched ? 1 :
                               0
                    },
                    //limit: 10
                },
                { 
                    name: 'Брошено',
                    filter: (anime) => {
                        if (anime.watched < (anime.episodes_aired || anime.episodes)) {
                            if (anime.lastWatched && Date.now() - anime.lastWatched > this.droppedTime) {
                                return true;
                            }
                        }
                        return false;
                    },
                    sort: function(a, b) {
                        return a.lastWatched && b.lastWatched ? b.lastWatched - a.lastWatched :
                               a.lastWatched ? -1 :
                               b.lastWatched ? 1 :
                               0
                    },
                    //limit: 10
                }
            ],
            selectedMain: null,
            dropdownMain: [
                {
                    name: 'Избранное аниме',
                    list: this.all_anime,
                    click: 'show_anime'
                },
                {
                    name: 'Избранная манга',
                    list: this.all_manga,
                    click: 'show_manga'
                }
            ]
        }
    },
    computed: {
        all_manga: function() {
            return this.$root.allManga
        },
        horisontalList: function() {
            if (this.selectedHorizontal) {
                let list = this.all_anime.filter(this.selectedHorizontal.filter);
                
                if (this.selectedHorizontal.sort) {
                    list.sort(this.selectedHorizontal.sort);
                }
                if (this.selectedHorizontal.limit) {
                    list = list.slice(0, this.selectedHorizontal.limit);
                }
                return list;
            } else {
                return [];
            }
        }
    },
    mounted: function() {
        this.selectedHorizontal = this.dropdownHorizontal[0];
        this.selectedMain = this.dropdownMain[0];
    },
    methods: {
        card_error: function(err) {
            err.target.src = 'img/img-error.jpg';
        }
    }
})

Vue.component('media', {
    template: getTemplate('media'),
    props: ['preview', 'full'],
    data: function() {
        return {
            active: false
        }
    },
    methods: {
        open: function() {
            this.active = true;
        },
        hide: function() {
            this.active = false;
        }
    },
    computed: {
        isImage: function() {
            return /\.(jpg|png|gif)/gi.test(this.full);
        },
        previewLink: function() {
            return this.preview.startsWith('/') ? 'https://shikimori.org/'+ this.preview : this.preview;
        },
        fullLink: function() {
            return this.full.startsWith('/') ? 'https://shikimori.org/'+ this.full : this.full;
        }
    },
    watch: {
        active: function(val) {
            if (val) {
                document.body.classList.add('overflow');
            } else {
                document.body.classList.remove('overflow');
            }
        }
    }
})
Vue.component('relate', {
    template: getTemplate('relate'),
    mixins: [Mixins.selectItem],
    props: ['relate_list'],
    methods: {
        relatedKind: function(kind) {
            return kind === 'movie' ? 'Фильм' :
                   kind === 'ova' ? 'OVA' :
                   kind === 'ona' ? 'ONA' :
                   kind === 'tv' ? 'TV-сериал' :
                   kind === 'special' ? 'Спешл' :
                   kind === 'manga' ? 'Манга' :
                   kind === 'manhwa' ? 'Манхва' :
                   kind === 'manhua' ? 'Маньхуа' :
                   kind === 'novel' ? 'Новелла' :
                   kind === 'doujin' ? 'Додзинси' :
                   kind === 'one_shot' ? 'Ваншот' :
                   kind
        }
    }
})
Vue.component('top-bar', {
    template: getTemplate('top-bar'),
    mixins: [Mixins.selectItem],
    props: ['allanime'],
    data: function() {
        return {
            search: '',
            oLoading_anime: true,
            oLoading_manga: true,
            searchOnline_anime: [],
            searchOnline_manga: [],
            onlineSearchTimeout: null,
            appVersion: remote.app.getVersion(),
            nav: [
                { name: 'Настройки', page: 'settings' },
                { name: 'О программе', page: 'about' }
            ]
        }
    },
    computed: {
        searchLocal_anime: function() {
            if (this.search.length === 0) return []
            
            let filtered = this.allanime.filter(a => {
                return a.name && a.name.toLowerCase().includes(this.search.toLowerCase()) ||
                       a.russian && a.russian.toLowerCase().includes(this.search.toLowerCase())
                })
                .slice(0, 10);
            
            return filtered
        },
        searchLocal_manga: function() {
            if (this.search.length === 0) return []
            
            let filtered = this.all_manga.filter(a => a.name.toLowerCase().includes(this.search.toLowerCase()) ||
                                                 a.russian.toLowerCase().includes(this.search.toLowerCase()))
                            .slice(0, 10);
            return filtered
        },
        all_manga: function() {
            return this.$root.allManga
        }
    },
    methods: {
        onlineSearch: function() {
            if (this.onlineSearchTimeout) clearTimeout(this.onlineSearchTimeout);
            
            this.oLoading_anime = true;
            this.oLoading_manga = true;
            let self = this;

            let fuseConfig = {
                shouldSort: true,
                threshold: 0.25,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [ "name", "russian" ]
            };
            
            // Ждем, пока пользователь наберет весь запрос
            this.onlineSearchTimeout = setTimeout(function() {
                Sources.search(self.search, function(results) {
                    if (results.length) {
                        if (results[0].type === 'anime') {
                            self.oLoading_anime = false;

                            let fuse = new Fuse(self.searchOnline_anime.concat(results), fuseConfig);

                            self.searchOnline_anime = fuse.search(self.search);
                        } else if (results[0].type === 'manga') {
                            self.oLoading_manga = false;
                            let fuse = new Fuse(self.searchOnline_manga.concat(results), fuseConfig);

                            self.searchOnline_manga = fuse.search(self.search)
                        }
                    }
                })
                PluginEvent({ type: 'search', query: self.search });

                ga.event('Search', 'new search', { evLabel: self.search, clientID: clientID });
            }, 1000)
        },
        start_page: function() {
            this.$emit('change_page', 'start')
        },
        change_page: function(page) {
            this.$emit('change_page', page)
        },
        clear: function() {
            setTimeout(() => { this.search = '' }, 150)
        },
        select: function(item) {
            if (item.source === 'shikimori.org') {
                if (item.type === 'anime') {
                    this.select_anime(item.id);
                } else {
                    this.select_manga(item.id);
                }
            } else {
                Sources.info(item, info => {
                    if (info == null) {
                        return;
                    }
                    this.$root.selected = info;
                    if (info.type == 'anime') {
                        this.change_page('anime');
                    } else if (info.type === 'manga') {
                        this.change_page('manga');
                    } else {
                        this.change_page(info.type);
                    }
                })
            }
        }
    },
    watch: {
        'search': function(newVal, oldVal) {
            if (newVal === '!dev') {
                require('electron').remote.getCurrentWindow().toggleDevTools();
            }
        }
    },
    mounted: function() {
        emitter.global.on('plugins-update-checked', data => {
            if (repos.updates().length > 0) {
                this.nav.forEach((item, index) => {
                    if (item.page === 'settings')
                        this.$set(this.nav[index], 'badge', repos.updates().length);
                })
            }
        })
    }
})

Vue.component('anime', {
    template: getTemplate('anime'),
    props: ['anime'],
    data: function() {
        return {
            config: config
        }
    },
    mixins: [Mixins.cleanDescr, Mixins.selectItem, Mixins.browser],
    computed: {
        favoriteClass: function() {
            return {
                'btn-outline-info': !this.anime.inDB,
                'btn-info': this.anime.inDB
            }
        },
        alreadyWatchedClass: function() {
            return {
                'btn-outline-warning': !this.anime.watched || this.anime.watched < this.anime.availableEp,
                'btn-warning': this.anime.watched === this.anime.availableEp
            }
        },
        dirClass: function() {
            return {
                'btn-outline-warning': !this.anime.folder,
                'btn-warning': this.anime.folder
            }
        },
        nextEpDate: function() {
            if (this.anime.status == 'ongoing' && this.anime.next_episode_at) {
                let d = new Date(this.anime.next_episode_at);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                return d.toLocaleDateString()
            } else {
                return null
            }
        },
        hasMedia: function() {
            return this.anime.screenshots && this.anime.screenshots.length > 0 ? true :
                   this.anime.videos && this.anime.videos.length > 0 ? true :
                   false;
        }
    },
    watch: {
        'anime.name': function(newVal, oldVal) {
            this.whenSelect();
        }
    },
    methods: {
        watchButton: function() {
            this.$emit('watch');
        },
        alreadyWatched: function() {
            if (!this.anime.inDB) {
                let self = this;
                db.anime.add(JSON.parse(JSON.stringify(this.anime)), function() {
                    db.anime.watchEp(self.anime, self.anime.availableEp, function() {
                        self.$set(self.anime, 'watched', self.anime.availableEp);
                        self.$root.$emit('update-all-anime');

                        PluginEvent({ type: 'alreadyWatched' });

                        ga.event('Already watched', 'New anime', { evLabel: self.anime.name, clientID: clientID });
                    });
                })
            } else {
                if (this.anime.watched && this.anime.watched === this.anime.availableEp) {
                    db.anime.watchEp(this.anime, 0, () => {
                        this.$set(this.anime, 'watched', 0);
                        this.$root.$emit('update-all-anime');

                        PluginEvent({ type: 'alreadyWatched' })

                        ga.event('Already watched', 'Unwatched', { evLabel: this.anime.name, clientID: clientID });
                    });
                } else {
                    db.anime.watchEp(this.anime, this.anime.availableEp, () => {
                        this.$set(this.anime, 'watched', this.anime.availableEp);
                        this.$root.$emit('update-all-anime');

                        ga.event('Already watched', 'Favorited', { evLabel: this.anime.name, clientID: clientID });

                        PluginEvent({ type: 'alreadyWatched' })
                    });
                }
            }
        },
        favorite: function() {
            if (!this.anime.inDB) {
                db.anime.add(JSON.parse(JSON.stringify(this.anime)), () => {
                    this.$set(this.anime, 'inDB', true);
                    this.$root.$emit('update-all-anime');

                    ga.event('Favorite', 'Add', { evLabel: this.anime.name, clientID: clientID });

                    PluginEvent({ type: 'favorite' });
                })
            } else {
                db.anime.remove(this.anime, () => {
                    this.$set(this.anime, 'inDB', false);
                    this.$root.$emit('update-all-anime');

                    ga.event('Favorite', 'Remove', { evLabel: this.anime.name, clientID: clientID });

                    PluginEvent({ type: 'favorite' })
                });
            }
        },
        showExternalLinks: function() {
            animeInfo.externalLinks(this.anime.id, (error, links) => {
                if (links) {
                    let knownNames = {
                        official_site: 'Официальный сайт',
                        wikipedia: 'Wikipedia',
                        anime_news_network: 'Anime News Network',
                        anime_db: 'AnimeDB',
                        myanimelist: 'MAL',
                        world_art: 'World Art',
                        kage_project: 'Kage Project'
                    }
                    links.forEach(link => {
                        let name = '';
                        if (knownNames[link.kind]) {
                            name = knownNames[link.kind];
                        } else {
                            name = (new URL(link.url)).hostname.replace('www.', '');
                        }
                        link.name = name;
                    })
                    links.splice(0,0, { url: 'https://shikimori.org/animes/' + this.anime.id, name: 'Shikimori' })
                    this.$set(this.anime, 'external_links', links);

                    PluginEvent({ type: 'externalLinks', links: links })
                }
            })
        },
        whenSelect: function() {
            if (!this.anime.source || this.anime.source.match(/shikimori/)) {
                if (config.get('anime.showRelated', true)) {
                    animeInfo.related(this.anime.id, (error, related) => {
                        if (related) {
                            this.$set(this.anime, 'related', related);
                        }
                    })
                }
            }

            if (this.anime.inDB && this.anime.next_episode_at && new Date(this.anime.next_episode_at) - Date.now() < 0) {
                animeInfo.info(this.anime.id, (error, anime) => {
                    if (error) {
                        log.error(error);
                    } else if (anime) {
                        let updated = Object.assign(this.anime, anime);

                        db.anime.update(updated, () => {
                            this.$root.$emit('update-all-anime');
                        })
                    }
                })
            }
        },
        selectDir: function() {
            let folder = null;
            if (!this.anime.folder) {
                folder = dialog.showOpenDialog({
                    properties: ['openDirectory']
                })
    
                if (folder && folder.length) {
                    folder = folder[0];
                }
            }
            db.anime.set(this.anime, { folder: folder }, (newDoc) => {
                if (newDoc) {
                    this.$set(this.anime, 'folder', folder);

                    PluginEvent({ type: 'setFolder', folder: folder });

                    ga.event('Folder', 'Set folder', { evLabel: this.anime.name, clientID: clientID });
                }
            })
        },
        showMoreAltNames: function() {
            $('.altNames__showMore').hide();
            $('.altNames__name.d-none').removeClass('d-none');
        }
    },
    created: function() {
        this.whenSelect();
    }
})
Vue.component('watch', {
    template: getTemplate('watch'),
    data: function() {
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
})

Vue.component('manga', {
    template: getTemplate('manga'),
    props: ['manga'],
    mixins: [Mixins.cleanDescr, Mixins.selectItem, Mixins.browser],
    watch: {
        'manga.name': function(newVal, oldVal) {
            this.whenSelect();
        }
    },
    computed: {
        favoriteClass: function() {
            return {
                'btn-outline-info': !this.manga.inDB,
                'btn-info': this.manga.inDB
            }
        },
        alreadyReadedClass: function() {
            return {
                'btn-outline-warning': !this.manga.readed || this.manga.readed.chapter < this.manga.chapters,
                'btn-warning': this.manga.readed && this.manga.readed.chapter === this.manga.chapters
            }
        },
        volumeText: function() {
            if ((''+this.manga.volumes).endsWith('1')) return 'том'
            if ((''+this.manga.volumes).match(/(2|3|4)$/)) return 'тома'
            return 'томов'
        },
        chapterText: function() {
            if ((''+this.manga.chapters).endsWith('1')) return 'глава'
            if ((''+this.manga.chapters).match(/(2|3|4)$/)) return 'главы'
            return 'глав'
        }
    },
    methods: {
        alreadyReaded: function() {
            let readed = {
                volume: this.manga.volumes,
                chapter: this.manga.chapters
            }
            if (!this.manga.inDB) {
                let self = this;
                
                db.manga.add(JSON.parse(JSON.stringify(this.manga)), function() {
                    db.manga.readChapter(self.manga, readed, function() {
                        self.$set(self.manga, 'readed', readed);
                        self.$root.$emit('update-all-manga');
                    });
                })
            } else {
                db.manga.readChapter(this.manga, readed, () => {
                    this.$set(this.manga, 'readed', readed);
                    this.$root.$emit('update-all-manga');
                });
            }
        },
        readButton: function() {
            this.$emit('read', this.manga);
        },
        favorite: function() {
            if (!this.manga.inDB) {
                db.manga.add(JSON.parse(JSON.stringify(this.manga)), () => {
                    this.$set(this.manga, 'inDB', true);
                    this.$root.$emit('update-all-manga');
                })
            } else {
                db.manga.remove(this.manga, () => {
                    this.$set(this.manga, 'inDB', false);
                    this.$root.$emit('update-all-manga');
                });
            }
        },
        whenSelect: function() {
            mangaInfo.related(this.manga.id, (error, related) => {
                if (related) {
                    this.$set(this.manga, 'related', related);
                }
            })
        },
        showExternalLinks: function() {
            
            mangaInfo.externalLinks(this.manga.id, (error, links) => {
                if (links) {
                    let knownNames = {
                        official_site: 'Официальный сайт',
                        wikipedia: 'Wikipedia',
                        anime_news_network: 'Anime News Network',
                        anime_db: 'AnimeDB',
                        myanimelist: 'MAL',
                        world_art: 'World Art',
                        kage_project: 'Kage Project',
                        readmanga: 'Read Manga'
                    }
                    links.forEach(link => {
                        let name = '';
                        if (knownNames[link.kind]) {
                            name = knownNames[link.kind];
                        } else {
                            name = (new URL(link.url)).hostname.replace('www.', '');
                        }
                        link.name = name;
                    })
                    links.splice(0,0, { url: 'https://shikimori.org/mangas/' + this.manga.id, name: 'Shikimori' })
                    this.$set(this.manga, 'external_links', links);
                }
            })
        },
    },
    created: function() {
        this.whenSelect();
    }
})
Vue.component('read', {
    template: getTemplate('read'),
    props: ['watch', 'manga'],
    data: function() {
        return {
            currentImg: '',
            currentPage: 1,
            totalPages: 1,
            imgArray: [],
            preload: {},
            loading: false,
            error: null,
            prevChapterLink: null,
            nextChapterLink: null,
            chapterUrl: null
        }
    },
    watch: {
        imgArray: function() {
            this.currentImg = this.imgArray[0] || '';
            this.totalPages = this.imgArray.length;
            this.preload = {};
            
            if (this.watch.bookmarkPage) {
                this.currentPage = this.watch.bookmarkPage;
                delete this.watch.bookmarkPage;
            } else {
                this.currentPage = 1;
            }
            
            this.preloadPage(this.currentPage + 1);
        },
        currentPage: function(newVal) {
            this.currentImg = this.imgArray[newVal - 1] || '';
            if (newVal < this.totalPages) {
                this.preloadPage(newVal + 1);
            }
            
            this.$scrollTo('.imgWrap', 500, {offset: -58});
        },
        chapterUrl: function(newVal, oldVal) {
            if (oldVal == null) return;
            
            this.loadChapter(newVal);
        }
    },
    computed: {
        bookmarkClass: function() {
            let bookmarkHere = this.manga.bookmark && 
                            this.manga.bookmark.volume === this.watch.volume && 
                            this.manga.bookmark.chapter === this.watch.chapter &&
                            this.manga.bookmark.page === this.currentPage
            return {
                'btn-outline-info': !bookmarkHere,
                'btn-info': bookmarkHere
            }
        }
    },
    methods: {
        back: function() {
            this.$emit('change_page', 'manga')
        },
        bookmark: function(event) {
            let bookmark = {
                volume: this.watch.volume,
                chapter: this.watch.chapter,
                page: this.currentPage,
                chapterUrl: this.chapterUrl
            }
            
            if (!this.manga.inDB) {
                db.manga.add(JSON.parse(JSON.stringify(this.manga)), () => {
                    db.manga.bookmark(this.manga, bookmark);
                    
                    this.$set(this.manga, 'bookmark', bookmark);
                    PluginEvent({ type: 'bookmark', added: true, watch: this.watch })
                })
            } else {
                if (this.bookmarkClass['btn-info']) {
                    // Если закладка уже стоит - удалить её.
                    let query = {};
                    if (this.manga.id) {
                        query = { id: this.manga.id };
                    } else if (this.manga.name && this.manga.source) {
                        query = { name: manga.name, source: this.manga.source };
                    }
                    db.manga.DB.update(query, { $unset: { bookmark: true } }, {}, () => {
                        this.$set(this.manga, 'bookmark', null)
                        PluginEvent({ type: 'bookmark', added: false, watch: this.watch })
                    })
                } else {
                    db.manga.bookmark(this.manga, bookmark);
                    this.$set(this.manga, 'bookmark', bookmark)

                    PluginEvent({ type: 'bookmark', added: true, watch: this.watch })
                }
            }
        },
        prevPage: function() {
            if (this.currentPage === 1) {
                this.prevChapter();
            } else {
                this.currentPage--;
                PluginEvent({ type: 'prevPage', watch: this.watch })
            }
        },
        nextPage: function() {
            if (this.currentPage === this.totalPages) {
                this.nextChapter()
            } else {
                this.currentPage++;

                PluginEvent({ type: 'nextPage', watch: this.watch })
            }
        },
        preloadPage: function(pageNum) {
            let realNum = pageNum - 1;
            if (!this.preload[realNum]) {
                let tmp = new Image();
                tmp.src = this.imgArray[realNum];
                
                this.preload[realNum] = true;
            }
        },
        nextChapter: function() {
            if (this.nextChapterLink) {
                this.loadChapter(this.nextChapterLink)
            }
        },
        prevChapter: function() {
            if (this.prevChapterLink) {
                this.loadChapter(this.prevChapterLink);
            }
        },
        loadChapter: function(url) {
            this.loading = true;
            onlineManga.getChapter(url, (error, chapter) => {
                this.loading = false;
                if (error != null) {
                    console.error("Can't load chapter");
                    if (error == 404) {
                        this.error = 'Манга была удалена.';
                    } else {
                        this.error = 'Ошибка при загрузки главы.'
                    }
                    PluginEvent({ type: 'error', error: { msg: this.error }, watch: this.watch })
                } else {
                    this.imgArray = chapter.images;
                    this.nextChapterLink = chapter.nextChapterLink;
                    this.prevChapterLink = chapter.prevChapterLink;
                    
                    this.watch.volume = chapter.volume;
                    this.watch.chapter = chapter.chapter;
                    this.$set(this, 'chapterUrl', url);

                    PluginEvent({ type: 'loadChapter', watch: this.watch })
                }
            })
        },
        updateVol_n_Chap: function(manga) {
            let changed = false;
            if (!this.manga.volumes || this.manga.volumes < manga.volumes) {
                this.manga.volumes = manga.volumes;
                changed = true;
            }
            if (!this.manga.chapters || this.manga.chapters < manga.chapters) {
                this.manga.chapters = manga.chapters;
                changed = true;
            }

            // Обновляем в БД
            if (this.manga.inDB && changed) {
                db.manga.set(this.manga, { volumes: this.manga.volumes, chapters: this.manga.chapters })
            }
        }
    },
    created: function() {
        this.loading = true;
        if (this.manga.bookmark) {
            this.loadChapter(this.manga.bookmark.chapterUrl);
            this.watch.bookmarkPage = this.manga.bookmark.page;
            
            onlineManga.getInfo(this.manga.bookmark.chapterUrl, (err, manga) => {
                if (manga) {
                    this.$set(this.manga, 'chapterList', manga.chapterLinks);
                    this.updateVol_n_Chap(manga);
                }
            })
        } else {
            mangaInfo.externalLinks(this.manga.id, (err, links) => {
                if (links && links.length) {
                    let readmanga = links.find(link => link.kind === 'readmanga')

                    if (readmanga) {
                        onlineManga.getInfo(readmanga.url, (err, manga) => {
                            this.loading = false;
                            
                            if (manga && manga.startReadLink) {
                                this.loadChapter(manga.startReadLink);
                            } else {
                                this.error = 'Манга была удалена'
                            }
                            if (manga && manga.chapterLinks && manga.chapterLinks.length) {
                                this.$set(this.manga, 'chapterList', manga.chapterLinks);
                            }
                            
                            // Заодно, если на shikimori не указано кол-во томов и глав 
                            // или указано меньше, чем их есть - исправляем это
                            this.updateVol_n_Chap(manga);
                        })
                    } else {
                        this.loading = false;
                        this.error = 'Не удалось найти ссылку на чтение манги'
                    }
                } else {
                    this.loading = false;
                }
            })
        }
    }
})

Vue.component('plugin', {
    props: ['plugin'],
    template: getTemplate('plugin'),
    mixins: [Mixins.browser],
    data: function() {
        return {
            hasUpdate: false,
            showRefresh: false,
            newVersion: null,
            forThisAppVersion: true
        }
    },
    computed: {
        active: {
            get: function() {
                return config.get('plugins.' + this.plugin.id + '.active', true);
            },
            set: function(val) {
                this.plugin.active = val;
                config.set('plugins.' + this.plugin.id + '.active', val);

                Plugins._setActive(this.plugin.id, val);
                
                if (val) {
                    ga.event('Plugins', 'Turn on', { evLabel: `${this.plugin.name} v${this.plugin.version} (${this.plugin.id})`, clientID: clientID });
                } else {
                    ga.event('Plugins', 'Turn off', { evLabel: `${this.plugin.name} v${this.plugin.version} (${this.plugin.id})`, clientID: clientID });
                }
            }
        },
        icon_src: function() {
            if (this.plugin.opt.icon != null) {
                return path.join(Plugins.pluginsDir(), this.plugin.id, this.plugin.opt.icon)
            } else {
                return null;
            }
        }
    },
    methods: {
        update: function() {
            repos.downloadPlugin(this.newVersion)
            .then(_ => {
                this.hasUpdate = false;
                this.showRefresh = true;
            })
            .catch(err => {
            });
        }
    },
    mounted: function() {
        let update = Plugins.hasUpdate(this.plugin.id);
        if (update.length > 0) {
            this.hasUpdate = true;
            this.newVersion = update[0];
        }

        this.forThisAppVersion = this.plugin.opt['min-version'] != null ? compareVersions(this.plugin.opt['min-version'], remote.app.getVersion()) < 1 : true;
    }
})

Vue.component('plugin-search', {
    template: getTemplate('plugin-search'),
    data: function() {
        return {
            query: '',
            result: [],
            analyticsCD: null,
            allRepos: repos.getAllReposInfo(),
            selected_category: 'all',
            selected_repo: 'all',
            allCat: []
        }
    },
    watch: {
        query: function(val) {
            this.search(val);
        },
        selected_category: function() {
            this.search(this.query)
        },
        selected_repo: function() {
            this.search(this.query)
        }
    },
    methods: {
        search: function(query) {
            this.result = repos.search(query);

            if (this.selected_category !== 'all') {
                this.result = this.result.filter(plug => Array.isArray(plug.category) && plug.category.includes(this.selected_category));
            }

            if (this.selected_repo !== 'all') {
                this.result = this.result.filter(plug => plug.repo.name === this.selected_repo);
            }

            if (this.analyticsCD) clearTimeout(this.analyticsCD);

            this.analyticsCD = setTimeout(_ => {
                ga.event('Plugins', 'Search', { evLabel: query, clientID: clientID });
            }, 700)
        }
    },
    mounted: function() {
        this.search();
        this.result.forEach(plug => {
            if (Array.isArray(plug.category)) {
                plug.category.forEach(category => {
                    if (!this.allCat.includes(category) && category !== 'source') {
                        this.allCat.push(category)
                    }
                })
            }
        });
    }
})
Vue.component('plugin-in-search', {
    template: getTemplate('plugin-in-search'),
    props: ['plugin'],
    data: function() {
        return {
            installing: false,
            installed: Plugins.hasPlugin({ id: this.plugin.id }),
            showRefresh: false,
            error: null
        }
    },
    computed: {
        icon_src: function() {
            if (this.plugin.icon != null) {
                return this.plugin.pluginDir + '/' + this.plugin.icon;
            } else {
                return null;
            }
        }
    },
    methods: {
        download: function() {
            this.installign = true;
            repos.downloadPlugin(this.plugin).then(_ => {
                this.installing = false;
                this.installed = true;
                this.showRefresh = true;

                ga.event('Plugins', 'Install', { evLabel: `${this.plugin.name} v${this.plugin.version} (${this.plugin.id})`, clientID: clientID });
            })
            .catch(err => {
                this.installing = false;
                this.installed = false;
                this.error = err;
            })
        }
    }
})
Vue.component('repos', {
    template: getTemplate('repos'),
    data: function() {
        return {
            reposInfo: [],
            error: null,
            repoUrl: '',
            allRepos: []
        }
    },
    methods: {
        modalShown: function() {
            this.repoUrl = '';
            this.$refs.url.focus();
        },
        handleOk: function(evt) {
            evt.preventDefault();
            if (this.repoUrl) {
                this.submit()
            }
        },
        submit: function() {
            this.$refs.modal.hide();
            repos.addRepo(this.repoUrl)
                .then((repo) => {
                    this.updateRepos();
                })
                .catch(err => {
                    if (err) {
                        this.error = err;
                    }
                });
            this.repoUrl = '';
        },
        updateRepos: function() {
            this.allRepos = repos.getAllReposInfo();
        },
        remove: function(link) {
            repos.remove(link);

            this.updateRepos();
        }
    },
    mounted: function() {
        this.updateRepos();
    }
})

Vue.component('settings', {
    template: getTemplate('settings'),
    mixins: [Mixins.browser,  Mixins.pluginsCategories],
    data: function() {
        return {
            server: server,
            serverPort: config.get('server.port', 3000),
            localIP: null,
            miner: miner,
            minerThreads: config.get('miner.threads', 2),
            minerThrottle: config.get('miner.throttle', 0.5) * 10,
            selected_category: 'all',
            selected_repo: 'all',
            pluginList: Plugins.getAllPlugins(),
            sourceList: Plugins.getAllSources(),
            tabs: [
                { 
                    name: 'Сервер',
                    pane: '#server-pane'
                },
                { 
                    name: 'Аниме',
                    pane: '#anime-pane'
                },
                { 
                    name: 'Плагины',
                    pane: '#plugins-pane'
                },
                { 
                    name: 'Майнер',
                    pane: '#miner-pane'
                }
            ]
        }
    },
    watch: {
        serverPort: function() {
            config.set('server.port', parseInt(this.serverPort));
        },
        minerThreads: function() {
            config.set('miner.threads', this.minerThreads);
            this.miner.miner.setNumThreads(this.minerThreads);
        },
        minerThrottle: function() {
            let thorottle = this.minerThrottle / 10;
            config.set('miner.throttle', thorottle);
            this.miner.miner.setThrottle(1-thorottle);
        }
    },
    computed: {
        serverStatus: function() {
            return this.server.active ? 'Включен' : 'Выключен'
        },
        minerStateText: function() {
            return this.miner.miner.isRunning() ? 'Включен' : 'Выключен'
        },
        minerStateClass: function() {
            return this.miner.miner.isRunning() ? 'text-success' : 'text-danger'
        },
        showRelated: {
            get: function() {
                return config.get('anime.showRelated', true);
            },
            set: function(newVal) {
                config.set('anime.showRelated', newVal);
            }
        },
        showMedia: {
            get: function() {
                return config.get('anime.showMedia', true);
            },
            set: function(newVal) {
                config.set('anime.showMedia', newVal);
            }
        },
        showNotes: {
            get: function() {
                return config.get('anime.showNotes', true);
            },
            set: function(newVal) {
                config.set('anime.showNotes', newVal);
            }
        },
        pluginList_filtered: function() {
            let plugins = this.pluginList.filter(plugin => {
                if (this.selected_category !== 'all') {
                    if (!Array.isArray(plugin.opt.category) || !plugin.opt.category.includes(this.selected_category)) {
                        return false
                    }
                }
                return true
            })
            let sources = [];
            if (this.selected_category === 'sources' || this.selected_category === 'all') {
                sources = [].concat(this.sourceList.anime, this.sourceList.manga);

            }
            
            return plugins.concat(sources);
        }
    },
    methods: {
        toggleServer: function() {
            if (!this.server.active) {
                this.server.start();

                ga.event('Server', 'Server on', { clientID: clientID });
            } else {
                this.server.stop();

                ga.event('Server', 'Server off', { clientID: clientID });
            }
        },
        toggleMiner: function() {
            if (miner.miner.isRunning()) {
                miner.stop();
                config.set('miner.autorun', false);

                ga.event('Miner', 'Miner off', { clientID: clientID });
            } else {
                miner.start();
                config.set('miner.autorun', true);

                ga.event('Miner', 'Miner on', { clientID: clientID });
            }
            this.$forceUpdate();
        },
        openPluginDir: function() {
            remote.shell.openItem(remote.app.getPath('userData') + '/plugins');
        },
        change_page: function(page) {
            this.$emit('change_page', page);
        }
    },
    created: function() {
        require('dns').lookup(require('os').hostname(), (err, add, fam) => {
            this.localIP = add;
        })
    },
    mounted: function() {
        let firstTab = $(this.tabs[0].pane).addClass('show active');

        if (repos.updates().length > 0) {
            this.tabs.forEach((item, index) => {
                if (item.pane === '#plugins-pane')
                    this.$set(this.tabs[index], 'badge', repos.updates().length);
            })
        }
    }
})
Vue.component('about', {
    mixins: [Mixins.browser],
    template: getTemplate('about')
})

var app = new Vue({
    el: '#app',
    data: {
        currentPage: null, // start
        selected: {},
        watch: {
            ep: 1,
            video_id: null
        },
        search: '',
        allAnime: [],
        allManga: [],
        modalContent: ''
    },
    watch: {
        selected: function(newVal) {
            if ((this.selected.url && this.selected.url.match('/animes')) || this.selected.type === 'anime') {
                this.selected.inDB = this.isInDB(newVal);
                this.selected.availableEp = this.selected.episodes_aired || this.selected.episodes;
            } else if ((this.selected.url && this.selected.url.match('/mangas')) || this.selected.type === 'manga') {
                this.selected.inDB = this.isInDB(newVal, 'allManga');
            }

            if (this.selected.aired_on) {
                this.selected.year = new Date(this.selected.aired_on).getFullYear()
            }
            if (this.selected.image && this.selected.image.original) {
                this.selected.cover = 'https://shikimori.org/' + this.selected.image.original
            }
            if ((this.selected.status && this.selected.status == 'released') || !this.selected.episodes_aired) {
                this.selected.episodes_aired = this.selected.episodes;
            }
            if (!this.selected.source) this.selected.source = 'shikimori.org';
            // FIXME: Исправить это!
            this.selected.sourceHost = this.selected.source;

            // Заметки
            this.selected.notes = this.selected.notes || {};
        },
        currentPage: function(val) {
            let pageName = '';
            if (/^(?:start|anime|manga|watch|read)/.test(val)) {
                pageName = this.selected ? this.selected.russian || this.selected.name : '';
            }
            if (val == 'start' && !this.selected) pageName = 'Start page';

            ga.pageview('http://anime-list.clan.su/', '/' + val, pageName, clientID);
        }
    },
    methods: {
        showAnime: function(anime) {
            this.$scrollTo('#app')
            if (typeof anime === 'number') {
                log.info('Show anime: %s', anime);

                if (this.isInDB(anime)) {
                    this.selected = this.allAnime.find(el => el.id === anime);
                    this.currentPage = 'anime';

                    this.pluginsEmitSelect();
                } else {
                    animeInfo.info(anime, (error, anime) => {
                        this.selected = anime;
                        this.currentPage = 'anime';

                        this.pluginsEmitSelect();
                    })
                }

            } else {
                log.info('Show anime: %s', anime.id || anime);

                this.selected = anime;
                this.currentPage = 'anime';

                this.pluginsEmitSelect();
            }
        },
        showManga: function(manga) {
            this.$scrollTo('#app')
            if (typeof manga === 'number') {
                log.info('Show manga: %s', manga);

                 if (this.isInDB(manga, 'allManga')) {
                    this.selected = this.allManga.find(el => el.id === manga);
                    this.currentPage = 'manga'

                    this.pluginsEmitSelect();
                } else {
                    mangaInfo.info(manga, (error, manga) => {
                        this.selected = manga;
                        this.currentPage = 'manga'

                        this.pluginsEmitSelect();
                    })
                }
            } else {
                log.info('Show manga: %s', manga.id);

                this.selected = manga;
                this.currentPage = 'manga'

                this.pluginsEmitSelect();
            }
        },
        watchOnline: function() {
            this.watch.ep = this.selected.watched ? this.selected.watched + 1 : 1;
            if (this.watch.ep > this.selected.availableEp) this.watch.ep = this.selected.availableEp;
            this.watch.video_id = null;

            this.currentPage="watch";
        },
        read: function(manga) {
            this.watch.volume = this.selected.readed && this.selected.readed.volume > 0 ? this.selected.readed.volume : 1;
            this.watch.chapter = this.selected.readed && this.selected.readed.chapter > 0 ? this.selected.readed.chapter + 1 : 1;

            this.currentPage="read";
        },
        updateAllAnime: function() {
            db.anime.getAll(anime => {
                this.allAnime = anime;

                if (this.selected) {
                    let foundSelected = this.allAnime.filter(anime => anime.id === this.selected.id);

                    if (foundSelected.length && foundSelected[0].kind === this.selected.kind) {
                        this.selected = foundSelected[0];
                    }
                }
            })
        },
        updateAllManga: function() {
            db.manga.getAll(manga => {
                this.allManga = manga;

                if (this.selected) {
                    let foundSelected = this.allManga.filter(anime => anime.id === this.selected.id);

                    if (foundSelected.length) {
                        this.selected = foundSelected[0];
                    }
                }
            })
        },
        /**
         * Обновляет список аниме или манги из базы
         * @param {string} dbName - имя файла базы
         * @param {string} into - имя переменной в которую записываются значения из базы
         */
        updateAll: function(dbName='anime', into='allAnime') {
            if (!db[dbName] || !db[dbName].getAll) {
                log.info('Update all. Wrong kind - ' + dbName);
                return;
            }

            db[dbName].getAll(items => {
                this[into] = items;

                if (this.selected) {
                    let foundSelected = this[into].filter(item => {
                        if (this.selected.id) {
                            return item.id === this.selected.id;
                        } else if (this.selected.name && this.selected.source && item.name && item.source) {
                            return this.selected.name === item.name && this.selected.source === item.source;
                        }
                    });

                    if (foundSelected.length && foundSelected[0].kind === this.selected.kind) {
                        this.selected = foundSelected[0];
                    }
                }
            })
        },
        showModal: function(content) {
            this.modal.content = content;
            this.modal.visible = true;
        },
        change_page: function(page) {
            if (page !== this.currentPage) {
                this.pluginsEmitSelect();
            }
            this.currentPage = page;
        },
        isInDB: function(item, storeName='allAnime') {
            if (typeof item === 'number') {
                return typeof this[storeName].find(el => el.id === item) !== 'undefined'
            } else if (typeof item === 'object') {
                return typeof this[storeName].find(el => {
                    if (item.id) {
                        return el.id === item.id
                    }
                    if (item.name && item.source && el.name && el.source) {
                        return item.name === el.name && item.source === el.source
                    }
                }) !== 'undefined'
            }
        },
        pluginsEmitSelect: function() {
            // Ждем, когда пройдет анимация.
            setTimeout(() => {
                PluginEvent({ type: 'openPage' })
            }, 550)
        }
    },
    created: function() {
        this.updateAll('anime', 'allAnime');
        this.updateAll('manga', 'allManga');

        this.currentPage = config.get('startPage', 'start');
    },
    mounted: function() {
        this.$on('update-all-anime', () => this.updateAll('anime', 'allAnime') );
        this.$on('update-all-manga', () => this.updateAllManga('manga', 'allManga') );
        this.$on('anime', this.showAnime );
        this.$on('manga', this.showManga );

        Plugins._setApp(this);
        Plugins.loadAllPlugins();
    }
})

function PluginEvent(event = {}) {
    event.selected = app.selected;
    event.page = app.currentPage;
    event.vue = {
        app: app,
        page: app.$children[1]
    }
    Plugins.$event(event);
}