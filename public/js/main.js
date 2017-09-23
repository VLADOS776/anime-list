var $ = jQuery = require('./js/libs/jquery-3.2.1.min.js'),
    bootstrap = require('./js/libs/bootstrap.min.js'),
    BootstrapVue = require('./js/libs/bootstrap-vue.js');

var request = require('request'),
    remote = require('electron').remote,
    Vue = require('./js/libs/vue.js'),
    db = require('./js/db.js'),
    online = require('./js/online'),
    animeInfo = require('./js/animeInfo');

//var anime = require('animejs');

var Mixins = {
    browser: {
        methods: {
            browser: function(url) {
                require('electron').shell.openExternal(url);
            }
        }
    }
}

Vue.use(BootstrapVue)

Vue.component('start', {
    template: '#start-tmp',
    props: ['all_anime', 'watching'],
    methods: {
        show_anime: function(anime) {
            this.$emit('anime', anime)
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
            document.body.classList.add('overflow');
        },
        hide: function() {
            this.active = false;
            document.body.classList.remove('overflow');
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

Vue.component('top-bar', {
    template: '#topBar-tmp',
    props: ['allanime'],
    data: function() {
        return {
            search: '',
            onlineSearchLoading: true,
            searchOnline: [],
            onlineSearchTimeout: null,
            appVersion: '1.0.0'
        }
    },
    computed: {
        searchLocal: function() {
            if (this.search.length === 0) return []
            let self = this;
            
            let filtered = this.allanime.filter(a => a.name.toLowerCase().includes(self.search.toLowerCase()) || a.russian.toLowerCase().includes(self.search.toLowerCase()))
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
                    if (err) console.log(err);
                    
                    try {
                        let list = JSON.parse(body);
                        self.searchOnline = list;
                    } catch (e) {
                        console.error(e)
                    }
                })
            }, 1000)
        },
        selectOnline: function(id) {
            let self = this;
            request({ url: "https://shikimori.org/api/animes/" + id }, function(err, response, body) {
                if (err) console.log(err);

                try {
                    let anime = JSON.parse(body);

                    self.$emit('anime', anime)
                } catch (e) {
                    console.error(e)
                }
            })
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
    }
})

Vue.component('anime', {
    template: '#anime-tmp',
    props: ['anime'],
    computed: {
        cleanDescr: function() {
            if (this.anime.description) {
                return this.anime.description.replace(/\[\/?character.*?\]/gi, '')
                        .replace(/\r\n/gi, '<br>')
                        .replace(/\[\[|\]\]/g, '')
            } else {
                return this.anime.description
            }
        },
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
                        self.$emit('update-all-anime');
                    });
                })
            } else {
                db.anime.watchEp(this.anime.id, this.anime.availableEp, () => {
                    this.$set(this.anime, 'watched', this.anime.availableEp);
                    this.$emit('update-all-anime');
                });
            }
        },
        favorite: function() {
            if (!this.anime.inDB) {
                db.anime.add(JSON.parse(JSON.stringify(this.anime)), () => {
                    this.$set(this.anime, 'inDB', true);
                    this.$emit('update-all-anime');
                })
            } else {
                db.anime.remove(this.anime.id, () => {
                    this.$set(this.anime, 'inDB', false);
                    this.$emit('update-all-anime');
                });
            }
        },
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
                   kind
        },
        select_anime: function(anime) {
            this.$emit('anime', anime)
        },
        whenSelect: function() {
            animeInfo.getRelated(this.anime.id, (error, related) => {
                if (related) {
                    this.$set(this.anime, 'related', related);
                }
            })

            if (this.anime.next_episode_at && new Date(this.anime.next_episode_at) - Date.now() < 0) {
                animeInfo.getAnimeInfo(this.anime.id, (error, anime) => {
                    if (error) {
                        console.error(error);
                    } else if (anime) {
                        let updated = Object.assign(this.anime, anime);

                        db.anime.update(updated, () => {
                            this.$emit('update-all-anime');
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
                if (this.watch.animeId == null) {
                    console.log('Animeid is null');
                    return;
                }

                online.getPlayers(this.watch.animeId, this.watch.ep, this.watch.videoId, function(vids) {
                    self.videos = vids;
                    self.loading = false;
                    online.getVideoAsync(2000);
                })
            } else {
                // Загрузить только видео
                this.loadingVideo = true;
                
                online.getPlayers(this.watch.animeId, this.watch.ep, this.watch.videoId, function(vids) {
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
                    db.anime.watchEp(self.watch.animeId, self.watch.ep);
                    self.$emit('update-all-anime');
                })
            } else {
                if (!this.anime.watched || this.watch.ep > this.anime.watched) {
                    db.anime.watchEp(this.watch.animeId, this.watch.ep);
                    
                    this.$emit('update-all-anime');
                }
            }
        },
        change_videoId: function(videoId) {
            this.watch.videoId = videoId;
            this.loadPlayer(true);
        }
    },
    created: function() {
        console.log('Created!');
        this.loadPlayer()
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
        selectedAnime: {},
        watch: {
            animeId: null,
            ep: 1,
            videoId: null
        },
        search: '',
        allAnime: [],
        modalContent: ''
    },
    watch: {
        selectedAnime: function(newVal) {
            this.selectedAnime.inDB = this.isInDB(newVal.id);
            this.selectedAnime.availableEp = this.selectedAnime.episodes_aired || this.selectedAnime.episodes;
        }
    },
    methods: {
        showAnime: function(anime) {
            console.log('Show anime: ', anime);
            
            if (typeof anime === 'number') {
                animeInfo.getAnimeInfo(anime, (error, anime) => {
                    this.selectedAnime = anime;
                    this.currentPage = 'anime'
                })
            } else {
                this.selectedAnime = anime;
                this.currentPage = 'anime'
            }

        },
        watchOnline: function() {
            // Изменять this.selectedAnime здесь!
            this.watch.animeId = this.selectedAnime.id;
            this.watch.ep = this.selectedAnime.watched ? this.selectedAnime.watched + 1 : 1;
            if (this.watch.ep > this.selectedAnime.availableEp) this.watch.ep = this.selectedAnime.availableEp;
            this.watch.videoId = null;
            
            this.currentPage="watch";
        },
        updateAllAnime: function() {
            db.anime.getAll(anime => {
                this.allAnime = anime;
                
                if (this.selectedAnime) {
                    let foundSelected = this.allAnime.filter(anime => anime.id === this.selectedAnime.id);
                    
                    if (foundSelected.length) {
                        this.selectedAnime = foundSelected [0];
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
        isInDB: function(animeId) {
            let inDB = false;
            this.allAnime.forEach(item => {
                if (item.id === animeId) inDB = true;
            })
            return inDB
        }
    },
    computed: {
        watching: function() {
            return this.allAnime.filter(anime => anime.watched < (anime.episodes_aired || anime.episodes))
        },
        
    },
    created: function() {
        this.updateAllAnime();
    }
})