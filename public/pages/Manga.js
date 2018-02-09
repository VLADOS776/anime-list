
































































































































































const Mixins = require('../Mixin');

const Relate = require('../components/Relate');

module.exports = {
    props: ['manga'],
    mixins: [Mixins.cleanDescr, Mixins.selectItem, Mixins.browser],
    components: { Relate },
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
            if (!this.manga.source || this.manga.source.match(/shikimori/)) {
                mangaInfo.related(this.manga.id, (error, related) => {
                    if (related) {
                        this.$set(this.manga, 'related', related);
                    }
                })
            }
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
}

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"manga\">\n    <div class=\"info d-flex mb-4\">\n        <div class=\"left-side mr-4\">\n            <img :src=\"manga.cover ? manga.cover : 'https://shikimori.org/' + manga.image.original\" :alt=\"manga.name\" class=\"thumb\">\n        </div>\n        <div class=\"right-side d-flex flex-column justify-content-around\">\n            <div>\n                <h5 v-if=\"manga.russian\">{{ manga.russian }} <small class=\"text-muted\" v-if=\"manga.aired_on\">{{ new Date(manga.aired_on).getFullYear() }}</small></h5>\n                <h6 v-if=\"manga.name\">{{ manga.name }}</h6>\n                <div>\n                    <span class=\"genre\" v-for=\"genre in manga.genres\">{{ typeof genre === 'string' ? genre : genre.russian }}</span>\n                </div>\n            </div>\n            <div v-if=\"manga.kind\">Тип: {{manga.kind}}</div>\n            <div v-if=\"manga.author\">Автор: {{manga.author}}</div>\n            <div>\n                <span class=\"text-primary\" v-if=\"manga.volumes\">{{manga.volumes}} {{volumeText}}</span>\n                • <span class=\"text-primary\" v-if=\"manga.chapters\">{{ manga.chapters }} {{chapterText}}</span>\n            </div>\n            <div v-if=\"manga.score\"><h3 class=\"text-primary\">{{manga.score}}</h3></div>\n            <div v-if=\"manga.bookmark\">Закладка: Том {{ manga.bookmark.volume }} Глава {{ manga.bookmark.chapter }} - страница {{ manga.bookmark.page }}</div>\n            <div class=\"buttons\">\n                <button class=\"btn btn-outline-warning\" @click=\"readButton\"><i class=\"fa fa-book\"></i> Читать</button>\n                <button class=\"btn\" :class=\"favoriteClass\" @click=\"favorite\"><i class=\"fa fa-star\"></i> В избранное</button>\n                <!--<button class=\"btn\" :class=\"alreadyReadedClass\" @click=\"alreadyReaded\"><i class=\"fa fa-check\"></i> Уже прочитано</button>-->\n            </div>\n        </div>\n    </div>\n    <div class=\"description\" v-if=\"manga.description\"><b>Описание:</b> <p v-html=\"cleanDescr()\"></p></div>\n    <div v-if=\"manga.source\" class=\"text-muted text-right\"><small>Источник: {{manga.sourceHost}}</small></div>\n    <div v-if=\"manga.external_links\" class=\"external_links d-flex justify-content-around\">\n        <div v-for=\"link in manga.external_links\">\n            <a href=\"#\" @click=\"browser(link.url)\">{{ link.name }}</a>\n        </div>\n    </div>\n    <span v-else=\"\" @click=\"showExternalLinks\" class=\"text-secondary cursor-pointer\">Показать ссылки на сайты</span>\n    <relate v-if=\"manga.related\" :relate_list=\"manga.related\"></relate>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-763ae0b3", module.exports)
  } else {
    hotAPI.update("_v-763ae0b3", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}