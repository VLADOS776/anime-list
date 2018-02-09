






















































const Mixins = require('../Mixin');

module.exports = {
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
}

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div>\n    <hr>\n    <h5>Связанное</h5>\n    <div class=\"related\">\n        <div v-for=\"relate in relate_list\" class=\"d-flex\" :class=\"{ anime: relate.anime, manga: relate.manga}\">\n            <template v-if=\"relate.anime\">\n                <div class=\"img-wrap\" @click=\"select_anime(relate.anime.id)\">\n                    <img :src=\"'https://shikimori.org/'+relate.anime.image.x96\" alt=\"\">\n                </div>\n                <div>\n                    <h6 @click=\"select_anime(relate.anime.id)\">{{relate.anime.russian}}</h6>\n                    <div>{{ relatedKind(relate.anime.kind) }} {{ new Date(relate.anime.aired_on).getFullYear()}} г.</div>\n                    <div>{{relate.relation_russian}}</div>\n                </div>\n            </template>\n            <template v-if=\"relate.manga\">\n                <div class=\"img-wrap\" @click=\"select_manga(relate.manga.id)\">\n                    <img :src=\"'https://shikimori.org/'+relate.manga.image.x96\" alt=\"\">\n                </div>\n                <div>\n                    <h6 @click=\"select_manga(relate.manga.id)\">{{relate.manga.russian}}</h6>\n                    <div>{{ relatedKind(relate.manga.kind) }} {{ new Date(relate.manga.aired_on).getFullYear()}} г.</div>\n                    <div>{{relate.relation_russian}}</div>\n                </div>\n            </template>\n        </div>\n    </div>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-7b217976", module.exports)
  } else {
    hotAPI.update("_v-7b217976", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}