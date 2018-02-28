


































































































































































































































































const Mixins = require('../Mixin');

const Media = require('../components/Media'),
      Relate = require('../components/Relate');

module.exports = {
    props: ['anime'],
    data() {
        return {
            config: config
        }
    },
    mixins: [Mixins.cleanDescr, Mixins.selectItem, Mixins.browser],
    components: { Media, Relate },
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
            if (this.anime.inDB && this.anime.next_episode_at && new Date(this.anime.next_episode_at) - Date.now() < 0) {
                // TODO: Переделать через Source
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
}

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"anime\">\n    <div class=\"info d-flex mb-4\">\n        <div class=\"left-side mr-4\">\n            <img :src=\"anime.cover\" :alt=\"anime.name\" class=\"thumb\" onerror=\"this.src=&quot;img/img-error.jpg&quot;\">\n        </div>\n        <div class=\"right-side d-flex flex-column justify-content-around\">\n            <div class=\"studios\">\n                <img v-for=\"studio in anime.studios\" :src=\"studio.img || 'https://shikimori.org/' + studio.image\" alt:=\"studio.name\" class=\"studio mb-1\">\n            </div>\n            <div>\n                <h5>{{ anime.russian }} <small class=\"text-muted\">{{ anime.year }}</small></h5>\n                <h6 v-if=\"anime.name\">{{ anime.name }}</h6>\n                <ul v-if=\"anime.altNames\" class=\"altNames\">\n                    <template v-for=\"(name, index) in anime.altNames\">\n                        <li v-if=\"index == 2\" class=\"altNames__showMore btn btn-outline-secondary btn-sm\" @click=\"showMoreAltNames\">...</li>\n                        <li class=\"altNames__name\" :class=\"{&quot;d-none&quot;: index > 1}\">{{name}}</li>\n                    </template>\n                </ul>\n                <div>\n                    <span class=\"genre\" v-for=\"genre in anime.genres\">{{ typeof genre === 'string' ? genre : genre.russian }}</span>\n                </div>\n            </div>\n            <div>\n                <span class=\"text-primary\">{{anime.episodes_aired}} / {{anime.episodes &gt; 0 ? anime.episodes : '??'}} эп.</span>\n                <template v-if=\"anime.duration\">\n                    • <span class=\"text-primary\">{{ anime.duration }} мин.</span>\n                </template>\n            </div>\n            <div v-if=\"nextEpDate\">Следующая серия: {{nextEpDate}}</div>\n            <div><h3 class=\"text-primary\">{{anime.score}}</h3></div>\n            <div v-if=\"anime.watched\">Просмотрено: {{ anime.watched }}</div>\n            <div class=\"buttons\">\n                <button class=\"btn btn-outline-warning\" @click=\"watchButton\"><i class=\"fa fa-play mr-1\"></i> Смотреть</button>\n                <button class=\"btn\" :class=\"favoriteClass\" @click=\"favorite\" v-b-tooltip.hover.auto.bottom=\"\" title=\"В избранное\"><i class=\"fa fa-star\"></i></button>\n                <button class=\"btn\" :class=\"alreadyWatchedClass\" @click=\"alreadyWatched\" v-b-tooltip.hover.auto.bottom=\"\" title=\"Уже просмотрено\"><i class=\"fa fa-check\"></i></button>\n                <button class=\"btn\" :class=\"dirClass\" @click=\"selectDir\" v-b-tooltip.hover.auto.bottom=\"\" title=\"Указать папку\">\n                    <i class=\"fa fa-folder-open\"></i>\n                </button>\n            </div>\n        </div>\n    </div>\n    <div class=\"description\" v-if=\"anime.description\"><b>Описание:</b> <p v-html=\"cleanDescr()\"></p></div>\n    <div v-if=\"anime.source\" class=\"text-muted text-right\"><small>Источник: {{anime.sourceHost}}</small></div>\n    <div v-if=\"anime.external_links\" class=\"external_links d-flex justify-content-around\">\n        <a v-for=\"link in anime.external_links\" href=\"#\" @click=\"browser(link.url)\">{{ link.name }}</a>\n    </div>\n    <span v-else-if=\"anime.source.match('shikimori')\" @click=\"showExternalLinks\" class=\"text-secondary cursor-pointer\">Показать ссылки на сайты</span>\n    <template v-if=\"config.get('anime.showNotes', true) &amp;&amp; Object.keys(anime.notes).length\">\n        <hr>\n        <h5>Заметки</h5>\n        <ul class=\"notes\">\n            <li v-for=\"(note, ep) in anime.notes\" v-if=\"note.length\">Эпизод {{ep}}: {{note}}</li>\n        </ul>\n    </template>\n    <template v-if=\"config.get('anime.showMedia', true) &amp;&amp; hasMedia\">\n        <hr>\n        <h5>Медиа</h5>\n        <div class=\"screensVideo\">\n            <media :preview=\"screen.preview\" :full=\"screen.original\" v-for=\"screen in anime.screenshots\"></media>\n            <media :preview=\"video.image_url\" :full=\"video.player_url\" v-for=\"video in anime.videos\" key=\"video.id\"></media>\n        </div>\n    </template>\n    <relate v-if=\"config.get('anime.showRelated', true) &amp;&amp; anime.related\" :relate_list=\"anime.related\"></relate>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-6929851a", module.exports)
  } else {
    hotAPI.update("_v-6929851a", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}