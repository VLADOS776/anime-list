<template>
    <div>
        <top-bar :allanime="allAnime" :all_manga="allManga" @anime="showAnime" @change_page="change_page"></top-bar>
        <div class="container mb-4 content">
            <transition name='slide' mode="out-in">
                <component
                    :is="currentPage"
                    :anime="selected"
                    :manga="selected"
                    :watch="watch"
                    :all_anime="allAnime"
                    :all_manga="allManga"
                    @watch="watchOnline"
                    @read="read"
                    @change_page="change_page"
                    @anime="showAnime"
                    @manga="showManga">
                </component>
            </transition>
        </div>
    </div>
</template>

<script>
    const Plugins = require('./plugin');

    const TopBar = require('./components/TopBar'),
          Start = require('./pages/Start'),
          Anime = require('./pages/Anime'),
          Manga = require('./pages/Manga'),
          Watch = require('./pages/Watch'),
          Read = require('./pages/Read'),
          Settings = require('./pages/Settings'),
          Repos = require('./pages/Repos'),
          PluginSearch = require('./pages/PluginSearch'),
          About = require('./pages/About');

    module.exports = {
        data() {
            return {
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
            }
        },
        components: { TopBar, Start, Anime, Manga, Watch, Read, Settings, Repos, PluginSearch, About },
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
            this.$root.$on('update-all-anime', () => this.updateAll('anime', 'allAnime') );
            this.$root.$on('update-all-manga', () => this.updateAllManga('manga', 'allManga') );
            this.$root.$on('anime', this.showAnime );
            this.$root.$on('manga', this.showManga );

            Plugins._setApp(this);
            Plugins.loadAllPlugins();
        }
    }
</script>

<style scoped>
    .container.content {
        margin-top: 4.5rem;
    }
</style>
