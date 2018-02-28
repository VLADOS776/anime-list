var __vueify_insert__ = require("vueify/lib/insert-css")
var __vueify_style__ = __vueify_insert__.insert("/* line 3, stdin */\n.read .imgWrap img[_v-0a7043e7], .read-style .imgWrap img[_v-0a7043e7] {\n  max-width: 100%;\n  margin: 0 auto;\n  display: block; }\n\n/* line 8, stdin */\n.read .select-chapter--wrap[_v-0a7043e7], .read-style .select-chapter--wrap[_v-0a7043e7] {\n  padding: 0 10px; }\n\n/* line 11, stdin */\n.read .select-wrap[_v-0a7043e7], .read-style .select-wrap[_v-0a7043e7] {\n  min-width: 210px;\n  text-align: center; }\n  /* line 14, stdin */\n  .read .select-wrap .select-page[_v-0a7043e7], .read-style .select-wrap .select-page[_v-0a7043e7] {\n    max-width: 70px;\n    display: inline-block; }\n")

















































































































































































































































































































































































const Sources = require('../sources');

module.exports = {
    props: ['watch', 'manga'],
    data() {
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
            hasPrevChapter: false,
            hasNextChapter: true,
            chapterUrl: null,
            chapters: null,
            chapterIndex: 0
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
        chapterIndex(val) {
            this.watch.chapter = this.chapters[this.chapters.length - this.chapterIndex - 1].chapter;
            this.loadChapter();
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
        },
        chapter() {
            return this.chapters[this.chapters.length - this.chapterIndex - 1]
        },
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
                chapterIndex: this.chapterIndex,
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
        prevChapter: function() {
            // TODO: Переделать. chapter - строка.
            if (this.hasPrevChapter) {
                this.chapterIndex--;
                this.loadChapter();
            }
            /*if (this.nextChapterLink) {
                this.loadChapter(this.nextChapterLink)
            }*/
        },
        nextChapter: function() {
            // TODO: Переделать. chapter - строка.
            if (this.hasNextChapter) {
                this.chapterIndex++;
                this.loadChapter();
            }
            /*if (this.prevChapterLink) {
                this.loadChapter(this.prevChapterLink);
            }*/
        },
        loadChapter: function(url) {
            this.loading = true;
            Sources.read({
                manga: this.manga,
                read: {
                    volume: this.watch.volume,
                    chapter: this.watch.chapter,
                    page: this.currentPage,
                    chapterIndex: this.chapterIndex
                },
                link: url,
                action: 'chapter'
            }, (err, info) => {
                this.loading = false;
                if (err == null) {
                    this.currentImg = info.image;
                    this.hasPrevChapter = info.prevChapter;
                    this.hasNextChapter = info.nextChapter;
                    this.imgArray = info.images;
                    this.chapters = info.chapters;

                    this.watch.chapter = this.chapter.chapter;
                    this.watch.volume = this.chapter.volume;

                    this.$set(this, 'chapterUrl', info.link);
                    PluginEvent({ type: 'loadChapter', watch: this.watch })
                } else {
                    console.error("Can't load chapter");
                    if (err == 404) {
                        this.error = 'Манга была удалена.';
                    } else {
                        this.error = 'Ошибка при загрузки главы.'
                    }
                    PluginEvent({ type: 'error', error: { msg: this.error }, watch: this.watch })
                }

            })
            /*onlineManga.getChapter(url, (error, chapter) => {
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
            })*/
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
            /*if (this.manga.source && this.manga.source.match('shikimori')) {
                mangaInfo.externalLinks(this.manga.id, (err, links) => {
                    if (links && links.length) {
                        let readmanga = links.find(link => link.kind === 'readmanga')

                        if (readmanga) {
                            onlineManga.getInfo(readmanga.url, (err, manga) => {
                                this.loading = false;
                                
                                if (manga && manga.startReadLink) {
                                    this.loadChapter(manga.startReadLink);
                                } else {
                                    this.error = 'Манга была удалена.';
                                }
                                if (manga && manga.chapterLinks && manga.chapterLinks.length) {
                                    this.$set(this.manga, 'chapterList', manga.chapterLinks);
                                }
                                
                                // Заодно, если на shikimori не указано кол-во томов и глав 
                                // или указано меньше, чем их есть - исправляем это
                                this.updateVol_n_Chap(manga);
                            })
                        } else {
                            //this.loading = false;
                            //this.error = 'Не удалось найти ссылку на чтение манги';
                        }
                    } else {
                        this.loading = false;
                    }
                })
            } else {*/
                this.loadChapter();
            //}
        }
    }
}

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"read\" _v-0a7043e7=\"\">\n    <div class=\"mb-2 d-flex justify-content-between\" _v-0a7043e7=\"\">\n        <button class=\"btn btn-outline-secondary btn-sm\" @click=\"back\" _v-0a7043e7=\"\"><i class=\"fa fa-arrow-left\" aria-hidden=\"true\" _v-0a7043e7=\"\"></i> Назад</button>\n        <div v-if=\"chapters &amp;&amp; chapters.length\" class=\"select-chapter--wrap\" _v-0a7043e7=\"\">\n            <select class=\"form-control select-chapter\" v-model=\"chapterIndex\" _v-0a7043e7=\"\">\n                <option v-for=\"(cp, index) in chapters\" :value=\"chapters.length - index - 1\" :key=\"cp.chapter\" _v-0a7043e7=\"\">{{cp.name}}</option>\n            </select>\n        </div>\n        <button class=\"btn btn-sm\" :class=\"bookmarkClass\" @click=\"bookmark\" _v-0a7043e7=\"\"><i class=\"fa fa-bookmark\" aria-hidden=\"true\" _v-0a7043e7=\"\"></i> Добавить закладку</button>\n    </div>\n    <div class=\"d-flex justify-content-center\" _v-0a7043e7=\"\">\n        <h5 _v-0a7043e7=\"\">{{manga.russian}}. Том {{watch.volume}} Глава {{watch.chapter}}</h5>\n    </div>\n    <div class=\"imgWrap\" _v-0a7043e7=\"\">\n        <div class=\"load-spinner\" v-if=\"loading\" _v-0a7043e7=\"\"></div>\n        <img :src=\"currentImg\" alt=\"\" v-else=\"\" _v-0a7043e7=\"\">\n        <div v-if=\"error\" _v-0a7043e7=\"\">\n            <span class=\"text-danger\" _v-0a7043e7=\"\">{{error}}</span>\n        </div>\n    </div>\n    <div class=\"d-flex justify-content-between mt-3 mb-3\" _v-0a7043e7=\"\">\n        <div class=\"d-flex flex-column\" _v-0a7043e7=\"\">\n            <button class=\"btn btn-outline-warning\" :class=\"{disabled: currentPage === 1}\" v-shortkey.once=\"{arrow: ['arrowleft']}\" @shortkey=\"prevPage\" @click=\"prevPage\" _v-0a7043e7=\"\">\n                    <i class=\"fa fa-arrow-left\" aria-hidden=\"true\" _v-0a7043e7=\"\"></i> Предыдущая страница\n            </button>\n            <button v-if=\"hasPrevChapter\" class=\"btn btn-outline-primary mt-2\" :class=\"{disabled: watch.chapter === 1 || !hasPrevChapter}\" @click=\"prevChapter\" _v-0a7043e7=\"\">\n                    <i class=\"fa fa-arrow-left\" aria-hidden=\"true\" _v-0a7043e7=\"\"></i> Предыдущая глава\n            </button>\n        </div>\n        <div class=\"select-wrap\" _v-0a7043e7=\"\">\n            Страница\n            <select class=\"form-control select-page\" v-model=\"currentPage\" _v-0a7043e7=\"\">\n                <option v-for=\"pageNum in totalPages\" :value=\"pageNum\" :key=\"pageNum\" _v-0a7043e7=\"\">{{pageNum}}</option>\n            </select>\n            из {{totalPages}}\n        </div>\n        <div class=\"d-flex flex-column\" _v-0a7043e7=\"\">\n            <button class=\"btn btn-outline-warning\" :class=\"{disabled: currentPage === totalPages}\" v-shortkey.once=\"{arrow: ['arrowright']}\" @shortkey=\"nextPage\" @click=\"nextPage\" _v-0a7043e7=\"\">\n                    <i class=\"fa fa-arrow-right\" aria-hidden=\"true\" _v-0a7043e7=\"\"></i> Следующая страница\n            </button>\n            <button v-if=\"hasNextChapter\" class=\"btn btn-outline-primary mt-2\" :class=\"{disabled: !hasNextChapter}\" @click=\"nextChapter\" _v-0a7043e7=\"\">\n                <i class=\"fa fa-arrow-right\" aria-hidden=\"true\" _v-0a7043e7=\"\"></i> Следующая глава\n            </button>\n        </div>\n    </div>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.dispose(function () {
    __vueify_insert__.cache["/* line 3, stdin */\n.read .imgWrap img[_v-0a7043e7], .read-style .imgWrap img[_v-0a7043e7] {\n  max-width: 100%;\n  margin: 0 auto;\n  display: block; }\n\n/* line 8, stdin */\n.read .select-chapter--wrap[_v-0a7043e7], .read-style .select-chapter--wrap[_v-0a7043e7] {\n  padding: 0 10px; }\n\n/* line 11, stdin */\n.read .select-wrap[_v-0a7043e7], .read-style .select-wrap[_v-0a7043e7] {\n  min-width: 210px;\n  text-align: center; }\n  /* line 14, stdin */\n  .read .select-wrap .select-page[_v-0a7043e7], .read-style .select-wrap .select-page[_v-0a7043e7] {\n    max-width: 70px;\n    display: inline-block; }\n"] = false
    document.head.removeChild(__vueify_style__)
  })
  if (!module.hot.data) {
    hotAPI.createRecord("_v-0a7043e7", module.exports)
  } else {
    hotAPI.update("_v-0a7043e7", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}