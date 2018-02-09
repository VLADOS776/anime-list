<template>
    <div class="read">
        <div class='mb-2 d-flex justify-content-between'>
            <button class="btn btn-outline-secondary btn-sm" @click="back"><i class="fa fa-arrow-left" aria-hidden="true"></i> Назад</button>
            <div v-if="manga.chapterList && manga.chapterList.length" class="select-chapter--wrap">
                <select class="form-control select-chapter" v-model="chapterUrl">
                    <option v-for="(cp, index) in manga.chapterList" :value="cp.link">{{cp.name}}</option>
                </select>
            </div>
            <button class='btn btn-sm' :class="bookmarkClass" @click='bookmark'><i class="fa fa-bookmark" aria-hidden="true"></i> Добавить закладку</button>
        </div>
        <div class='d-flex justify-content-center'>
            <h5>{{manga.russian}}. Том {{watch.volume}} Глава {{watch.chapter}}</h5>
        </div>
        <div class="imgWrap">
            <div class='load-spinner' v-if='loading'></div>
            <img :src="currentImg" alt="" v-else>
            <div v-if='error'>
                <span class='text-danger'>{{error}}</span>
            </div>
        </div>
        <div class="d-flex justify-content-between mt-3 mb-3">
            <div class="d-flex flex-column">
                <button 
                    class="btn btn-outline-warning"
                    :class="{disabled: currentPage === 1}"
                    v-shortkey.once="{arrow: ['arrowleft']}"
                    @shortkey="prevPage"
                    @click="prevPage">
                        <i class="fa fa-arrow-left" aria-hidden="true"></i> Предыдущая страница
                </button>
                <button
                    v-if="prevChapterLink"
                    class="btn btn-outline-primary mt-2"
                    :class="{disabled: watch.chapter === 1 || !prevChapterLink}"
                    @click="prevChapter">
                        <i class="fa fa-arrow-left" aria-hidden="true"></i> Предыдущая глава
                </button>
            </div>
            <div class="select-wrap">
                Страница
                <select class="form-control select-page" v-model="currentPage">
                    <option v-for="pageNum in totalPages" :value="pageNum">{{pageNum}}</option>
                </select>
                из {{totalPages}}
            </div>
            <div class="d-flex flex-column">
                <button
                    class="btn btn-outline-warning"
                    :class="{disabled: currentPage === totalPages}"
                    v-shortkey.once="{arrow: ['arrowright']}"
                    @shortkey="nextPage"
                    @click="nextPage">
                        <i class="fa fa-arrow-right" aria-hidden="true"></i> Следующая страница
                </button>
                <button
                    v-if="nextChapterLink"
                    class="btn btn-outline-primary mt-2"
                    :class="{disabled: !nextChapterLink}"
                    @click="nextChapter">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i> Следующая глава
                </button>
            </div>
        </div>
    </div>
</template>

<script>
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
            Sources.read({
                manga: this.manga,
                read: {
                    volume: this.watch.volume,
                    chapter: this.watch.chapter,
                    page: this.currentPage
                },
                link: url,
                action: 'chapter'
            }, (err, info) => {
                this.loading = false;
                if (err == null) {
                    this.currentImg = info.image;
                    this.prevChapterLink = info.prevChapterLink;
                    this.nextChapterLink = info.nextChapterLink;
                    this.imgArray = info.images;

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
            if (this.manga.source && this.manga.source.match('shikimori')) {
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
            } else {
                this.loadChapter();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .read, .read-style {
        .imgWrap img {
            max-width: 100%;
            margin: 0 auto;
            display: block;
        }
        .select-chapter--wrap {
            padding: 0 10px;
        }
        .select-wrap {
            min-width: 210px;
            text-align: center;
            .select-page {
                max-width: 70px;
                display: inline-block;
            }
        }
    }

</style>
