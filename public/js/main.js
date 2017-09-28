var $ = jQuery = require('./js/libs/jquery-3.2.1.min.js'),
    bootstrap = require('./js/libs/bootstrap.min.js');

var request = require('request'),
    remote = require('electron').remote;

var Vue = require('./js/libs/vue.js'),
    db = require('./js/db.js'),
    online = require('./js/online'),
    animeInfo = require('./js/shikimoriInfo').anime,
    mangaInfo = require('./js/shikimoriInfo').manga;

var onlineManga = require('./js/onlineManga.js');

const log = require('./js/log');

//var anime = require('animejs');

/* === TODO LIST ===
** TODO: Логин на shikimori и импорт списков.
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
    }
}

Vue.use(require('./js/libs/bootstrap-vue.js'));
Vue.use(require('vue-scrollto'));
Vue.use(require('vue-shortkey'));

Vue.component('start', {
    template: '#start-tmp',
    props: ['all_anime', 'watching'],
    mixins: [Mixins.selectItem],
    computed: {
        all_manga: function() {
            return this.$root.allManga
        }
    }
})

Vue.component('media', {
    template: '#media-tmp',
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
    template: '#relate-tmp',
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
    template: '#topBar-tmp',
    props: ['allanime'],
    data: function() {
        return {
            search: '',
            onlineSearchLoading: true,
            searchOnline: [],
            onlineSearchTimeout: null,
            appVersion: remote.app.getVersion()
        }
    },
    computed: {
        searchLocal: function() {
            if (this.search.length === 0) return []
            
            let filtered = this.allanime.filter(a => a.name.toLowerCase().includes(this.search.toLowerCase()) || a.russian.toLowerCase().includes(this.search.toLowerCase()))
                            .slice(0, 10);
            
            return filtered
        }
    },
    methods: {
        selectSearch: function(item) {
            this.search = '';
            this.$emit('anime', item)
        },
        onlineSearch: function() {
            if (this.onlineSearchTimeout) clearTimeout(this.onlineSearchTimeout);
            
            this.onlineSearchLoading = true;
            let self = this;
            
            // Ждем, пока пользователь наберет весь запрос
            this.onlineSearchTimeout = setTimeout(function() {
                request({ url: "https://shikimori.org/api/animes", qs: { search: self.search, limit: 10 }}, function(err, response, body) {
                    self.onlineSearchLoading = false;
                    if (err) log.error(err);
                    
                    try {
                        let list = JSON.parse(body);
                        self.searchOnline = list;
                    } catch (e) {
                        log.error(e)
                    }
                })
            }, 1000)
        },
        selectOnline: function(id) {
            let self = this;
            self.$emit('anime', id)
        },
        start_page: function() {
            this.$emit('change_page', 'start')
        },
        change_page: function(page) {
            this.$emit('change_page', page)
        },
        clear: function() {
            setTimeout(() => { this.search = '' }, 150)
        }
    },
    watch: {
        'search': function(newVal, oldVal) {
            if (newVal === '!dev') {
                require('electron').remote.getCurrentWindow().toggleDevTools();
            }
        }
    }
})

Vue.component('anime', {
    template: '#anime-tmp',
    props: ['anime'],
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
            return this.anime.screenshots.length > 0 || this.anime.videos.length > 0
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
                    db.anime.watchEp(self.anime.id, self.anime.availableEp, function() {
                        self.$set(self.anime, 'watched', self.anime.availableEp);
                        self.$root.$emit('update-all-anime');
                    });
                })
            } else {
                if (this.anime.watched && this.anime.watched === this.anime.availableEp) {
                    db.anime.watchEp(this.anime.id, 0, () => {
                        this.$set(this.anime, 'watched', 0);
                        this.$root.$emit('update-all-anime');
                    });
                } else {
                    db.anime.watchEp(this.anime.id, this.anime.availableEp, () => {
                        this.$set(this.anime, 'watched', this.anime.availableEp);
                        this.$root.$emit('update-all-anime');
                    });
                }
            }
        },
        favorite: function() {
            if (!this.anime.inDB) {
                db.anime.add(JSON.parse(JSON.stringify(this.anime)), () => {
                    this.$set(this.anime, 'inDB', true);
                    this.$root.$emit('update-all-anime');
                })
            } else {
                db.anime.remove(this.anime.id, () => {
                    this.$set(this.anime, 'inDB', false);
                    this.$root.$emit('update-all-anime');
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
                }
            })
        },
        whenSelect: function() {
            animeInfo.related(this.anime.id, (error, related) => {
                if (related) {
                    this.$set(this.anime, 'related', related);
                }
            })

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
        }
    },
    created: function() {
        this.whenSelect();
    }
})
Vue.component('watch', {
    template: '#watch-tmp',
    data: function() {
        return {
            videos: null,
            loading: false,
            loadingVideo: false
        }
    },
    props: ['watch', 'anime'],
    computed: {
        videoEmbed: function() {
            if (this.videos.player && this.videos.player.embed && this.videos.player.embed.startsWith('//')) {
                return 'http:' + this.videos.player.embed
            }
        }
    },
    watch: {
        'watch.ep': function() {
            this.loadPlayer();
        }
    },
    methods: {
        loadPlayer: function(videoOnly=false) {
            // Загрузить всё
            let self = this;
            if (!videoOnly) {
                this.loading = true;
                if (this.anime.id == null) {
                    log.error('Animeid is null');
                    return;
                }

                online.getPlayers(this.anime.id, this.watch.ep, this.watch.videoId, function(vids) {
                    self.videos = vids;
                    self.loading = false;
                    online.getVideoAsync(2000);
                })
            } else {
                // Загрузить только видео
                this.loadingVideo = true;
                
                online.getPlayers(this.anime.id, this.watch.ep, this.watch.videoId, function(vids) {
                    self.videos.player = vids.player;
                    self.loadingVideo = false;
                    online.getVideoAsync(2000);
                })
            }
        },
        back: function() {
            this.$emit('change_page', 'anime')
        },
        prevEp: function() {
            if (this.watch.ep > 1) {
                this.watch.ep--;
                this.watch.videoId = null;
                this.loadPlayer();
            }
        },
        nextEp: function() {
            if (this.watch.ep < this.anime.episodes_aired || this.anime.episodes) {
                this.watch.ep++;
                this.watch.videoId = null;
                this.loadPlayer();
            }
        },
        markAsWatched: function() {
            if (!this.anime.inDB) {
                let self = this;
                db.anime.add(JSON.parse(JSON.stringify(this.anime)), function() {
                    db.anime.watchEp(self.anime.id, self.watch.ep);
                    self.$root.$emit('update-all-anime');
                })
            } else {
                if (!this.anime.watched || this.watch.ep > this.anime.watched) {
                    db.anime.watchEp(this.anime.id, this.watch.ep);
                    
                    this.$root.$emit('update-all-anime');
                }
            }
        },
        change_videoId: function(videoId) {
            this.watch.videoId = videoId;
            this.loadPlayer(true);
        }
    },
    created: function() {
        log.info('Watch screen created!');
        this.loadPlayer()
    }
})

Vue.component('manga', {
    template: '#manga-tmp',
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
                    db.manga.readChapter(self.manga.id, readed, function() {
                        self.$set(self.manga, 'readed', readed);
                        self.$root.$emit('update-all-manga');
                    });
                })
            } else {
                db.manga.readChapter(this.manga.id, readed, () => {
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
                db.manga.remove(this.manga.id, () => {
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
    template: '#read-tmp',
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
        bookmark: function() {
            let bookmark = {
                volume: this.watch.volume,
                chapter: this.watch.chapter,
                page: this.currentPage,
                chapterUrl: this.chapterUrl
            }
            
            if (!this.manga.inDB) {
                db.manga.add(JSON.parse(JSON.stringify(this.manga)), () => {
                    db.manga.bookmark(this.manga.id, bookmark);
                    this.$root.$emit('update-all-manga');
                })
            } else {
                db.manga.bookmark(this.manga.id, bookmark);
                this.$root.$emit('update-all-manga');
            }
            
        },
        prevPage: function() {
            if (this.currentPage === 1) {
                this.prevChapter();
            } else {
                this.currentPage--;
            }
        },
        nextPage: function() {
            if (this.currentPage === this.totalPages) {
                this.nextChapter()
            } else {
                this.currentPage++;
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
                this.loadChapter(this.prevChapterLink)
            }
        },
        loadChapter: function(url) {
            onlineManga.getChapter(url, (error, chapter) => {
                this.loading = false;
                if (error != null) {
                    console.error("Can't load chapter");
                    if (error == 404) {
                        this.error = 'Манга была удалена.'
                    } else {
                        this.error = 'Ошибка при загрузки главы.'
                    }
                } else {
                    this.imgArray = chapter.images;
                    this.nextChapterLink = chapter.nextChapterLink;
                    this.prevChapterLink = chapter.prevChapterLink;
                    
                    this.watch.volume = chapter.volume;
                    this.watch.chapter = chapter.chapter;
                    this.chapterUrl = url;
                }
            })
        }
    },
    created: function() {
        this.loading = true;
        if (this.manga.bookmark) {
            this.loadChapter(this.manga.bookmark.chapterUrl);
            this.watch.bookmarkPage = this.manga.bookmark.page;
        } else {
            mangaInfo.externalLinks(this.manga.id, (err, links) => {
                if (links && links.length) {
                    let readmanga = links.find(link => link.kind === 'readmanga')

                    if (readmanga) {
                        let url = `${readmanga.url}/vol${this.watch.volume}/${this.watch.chapter}?mtr=1`
                        this.loadChapter(url);
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

Vue.component('about', {
    mixins: [Mixins.browser],
    template: '#about-tmp'
})

var app = new Vue({
    el: '#app',
    data: {
        currentPage: 'start', // start
        selected: {},
        watch: {
            ep: 1,
            videoId: null
        },
        search: '',
        allAnime: [],
        allManga: [],
        modalContent: ''
    },
    watch: {
        selected: function(newVal) {
            if (this.selected.url.match('/animes')) {
                this.selected.inDB = this.isInDB(newVal.id);
                this.selected.availableEp = this.selected.episodes_aired || this.selected.episodes;
            }
            if (this.selected.url.match('/mangas')) {
                this.selected.inDB = this.isInDB(newVal.id, 'allManga');
            }
        }
    },
    methods: {
        showAnime: function(anime) {
            this.$scrollTo('#app')
            if (typeof anime === 'number') {
                log.info('Show anime: %s', anime);
                
                if (this.isInDB(anime)) {
                    this.selected = this.allAnime.find(el => el.id === anime);
                    
                    this.currentPage = 'anime'
                } else {
                    animeInfo.info(anime, (error, anime) => {
                        this.selected = anime;
                        this.currentPage = 'anime'
                    })
                }
                
            } else {
                log.info('Show anime: %s', anime.id);
                
                this.selected = anime;
                this.currentPage = 'anime'
            }
        },
        showManga: function(manga) {
            this.$scrollTo('#app')
            if (typeof manga === 'number') {
                log.info('Show manga: %s', manga);
                
                 if (this.isInDB(manga, 'allManga')) {
                    this.selected = this.allManga.find(el => el.id === manga);
                    
                    this.currentPage = 'manga'
                } else {
                    mangaInfo.info(manga, (error, manga) => {
                        this.selected = manga;
                        this.currentPage = 'manga'
                    })
                }
            } else {
                log.info('Show manga: %s', manga.id);
                
                this.selected = manga;
                this.currentPage = 'manga'
            }
        },
        watchOnline: function() {
            this.watch.ep = this.selected.watched ? this.selected.watched + 1 : 1;
            if (this.watch.ep > this.selected.availableEp) this.watch.ep = this.selected.availableEp;
            this.watch.videoId = null;
            
            this.currentPage="watch";
        },
        read: function(manga) {
            this.watch.volume = this.selected.readed ? this.selected.readed.volume : 1;
            this.watch.chapter = this.selected.readed ? this.selected.readed.chapter + 1 : 1;
            
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
        updateAll: function(dbName='anime', into='allAnime') {
            // dbName - имя базы, которую обновляем
            // into - в какую переменную записываем
            if (!db[dbName] || !db[dbName].getAll) {
                log.info('Update all. Wrong kind - ' + dbName);
                return;
            }
            
            db[dbName].getAll(items => {
                this[into] = items;
                
                if (this.selected) {
                    let foundSelected = this[into].filter(item => item.id === this.selected.id);
                    
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
            this.currentPage = page;
        },
        isInDB: function(itemId, storeName='allAnime') {
            return typeof this[storeName].find(el => el.id === itemId) !== 'undefined'
        }
    },
    computed: {
        watching: function() {
            return this.allAnime
                       .filter(anime => anime.watched < (anime.episodes_aired || anime.episodes))
                       .sort((a, b) =>  a.lastWatched && b.lastWatched ? b.lastWatched - a.lastWatched : 
                                        a.lastWatched ? -1 :
                                        b.lastWatched ? 1 : 
                                        0)
                       .slice(0, 10)
        },
        
    },
    mounted: function() {
        this.$on('update-all-anime', () => this.updateAll('anime', 'allAnime') );
        this.$on('update-all-manga', () => this.updateAllManga('manga', 'allManga') );
        this.$on('anime', this.showAnime );
        this.$on('manga', this.showManga );
    },
    created: function() {
        this.updateAll('anime', 'allAnime');
        this.updateAll('manga', 'allManga');
    }
})