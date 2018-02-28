



































































































































































const Mixins = require('../Mixin'),
      config = require('../js/config');

module.exports = {
    props: ['all_anime', 'all_manga'],
    mixins: [ Mixins.selectItem ],
    data: function() {
        return {
            selectedHorizontal: null,
            droppedTime: config.get('anime.dropTime', 18) * config.get('anime.dropTimeMultiply', 1000 * 60 * 60 * 24), // 2.5 weeks
            dropdownHorizontal: [
                { 
                    name: 'Смотрю',
                    filter: (anime) => {
                        if (anime.watched > 0 && anime.watched < (anime.episodes_aired || anime.episodes)) {
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
}

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"start\">\n    <h4>{{selectedHorizontal ? selectedHorizontal.name : ''}} \n        <span class=\"dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"></span>\n        <div class=\"dropdown-menu\">\n            <a v-for=\"item in dropdownHorizontal\" href=\"#\" class=\"dropdown-item\" @click=\"selectedHorizontal = item\" :key=\"item.name\">{{item.name}}</a>\n        </div>\n    </h4>\n    <div class=\"watching d-flex mb-3 pb-2\" v-if=\"horisontalList &amp;&amp; horisontalList.length\">\n        <div class=\"card\" v-for=\"anime in horisontalList\" :key=\"anime.russian\" @click=\"select_anime(anime)\">\n            <img :src=\"anime.cover || 'https://shikimori.org/' +anime.image.original\" :alt=\"anime.name\" class=\"card-img\" @error=\"card_error\">\n            <div class=\"card-body card-img-overlay\">\n                <h4 class=\"card-title\">{{anime.russian}}</h4>\n                <h6 class=\"card-subtitle mb-2 text-muted\">{{anime.name}}</h6>\n                <p class=\"card-text\">{{anime.watched}} / {{anime.episodes_aired || anime.episodes}}</p>\n            </div>\n        </div>\n    </div>\n    <div class=\"mb-3 pb-2\" v-else=\"\">\n            <p>Здесь пока ничего нет...</p>\n    </div>\n    <h4>Избранное аниме</h4>\n    <template v-if=\"all_anime &amp;&amp; all_anime.length\">\n        <div class=\"cards-wrap\">\n            <b-card-group columns=\"\">\n                <div class=\"card\" v-for=\"anime in all_anime\" :key=\"anime.russian\" @click=\"select_anime(anime)\">\n                    <img :src=\"anime.cover || 'https://shikimori.org/' +anime.image.original\" :alt=\"anime.name\" class=\"card-img\" @error=\"card_error\">\n                    <div class=\"card-body card-img-overlay\">\n                        <h4 class=\"card-title\">{{anime.russian}}</h4>\n                        <h6 class=\"card-subtitle mb-2 text-muted\">{{anime.name}}</h6>\n                    </div>\n                </div>\n            </b-card-group>\n        </div>\n    </template>\n    <template v-else=\"\">\n        <p>Здесь пока ничего нет. Используйте поиск, чтобы добавить аниме в избранное.</p>\n    </template>\n    <h4>Избранная манга</h4>\n    <template v-if=\"all_manga &amp;&amp; all_manga.length\">\n        <div class=\"cards-wrap\">\n            <b-card-group columns=\"\">\n                <div class=\"card\" v-for=\"manga in all_manga\" :key=\"manga.russian\" @click=\"select_manga(manga)\">\n                    <img :src=\"manga.cover || 'https://shikimori.org/' +manga.image.original\" :alt=\"manga.name\" class=\"card-img\" @error=\"card_error\">\n                    <div class=\"card-body card-img-overlay\">\n                        <h4 class=\"card-title\">{{manga.russian}}</h4>\n                        <h6 class=\"card-subtitle mb-2 text-muted\">{{manga.name}}</h6>\n                    </div>\n                </div>\n            </b-card-group>\n        </div>\n    </template>\n    <template v-else=\"\">\n        <p>Здесь пока ничего нет. Используйте поиск, чтобы добавить мангу в избранное.</p>\n    </template>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-09abda61", module.exports)
  } else {
    hotAPI.update("_v-09abda61", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}