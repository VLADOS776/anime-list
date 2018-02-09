var __vueify_insert__ = require("vueify/lib/insert-css")
var __vueify_style__ = __vueify_insert__.insert("/* line 14, src/scss/_theme.scss */\nbody[_v-464f561b] {\n  background-image: radial-gradient(at top, rgba(255, 255, 255, 0.15), transparent 45%), url(\"../img/bg.png\");\n  font-family: 'Futura';\n  color: #d6d6d6;\n  background-repeat: no-repeat, repeat; }\n\n/* line 20, src/scss/_theme.scss */\n.text-primary[_v-464f561b] {\n  color: #FCE397 !important; }\n\n/* line 23, src/scss/_theme.scss */\n.btn-outline-warning[_v-464f561b] {\n  color: #FCE397;\n  border-color: #FCE397; }\n  /* line 26, src/scss/_theme.scss */\n  .btn-outline-warning[_v-464f561b]:hover {\n    background-color: #f9c834; }\n  /* line 29, src/scss/_theme.scss */\n  .btn-outline-warning.disabled[_v-464f561b] {\n    color: #FCE397; }\n    /* line 31, src/scss/_theme.scss */\n    .btn-outline-warning.disabled[_v-464f561b]:hover {\n      color: #fff; }\n\n/* line 36, src/scss/_theme.scss */\n.form-control[_v-464f561b] {\n  background-color: #282C2F;\n  color: #d6d6d6; }\n  /* line 39, src/scss/_theme.scss */\n  .form-control[_v-464f561b]:focus {\n    background-color: #282C2F;\n    color: #d6d6d6;\n    border-color: #FCE397; }\n\n/* line 45, src/scss/_theme.scss */\n.nav-tabs .nav-link[_v-464f561b] {\n  color: #fff; }\n  /* line 47, src/scss/_theme.scss */\n  .nav-tabs .nav-link.active[_v-464f561b], .nav-tabs .nav-link[_v-464f561b]:hover {\n    background-color: rgba(0, 0, 0, 0.3);\n    color: #FCE397;\n    border-color: transparent;\n    border-bottom: 2px solid #FCE397; }\n  /* line 53, src/scss/_theme.scss */\n  .nav-tabs .nav-link[_v-464f561b]:hover {\n    color: #b3b3b3; }\n\n/* line 58, src/scss/_theme.scss */\nhr[_v-464f561b] {\n  height: 1.5rem;\n  background-image: repeating-linear-gradient(-45deg, rgba(39, 39, 39, 0.45), rgba(39, 39, 39, 0.45) 2px, transparent 2px, transparent 6px);\n  border-top: none; }\n\n/* === Scrollbar === */\n/* line 65, src/scss/_theme.scss */\n[_v-464f561b]::-webkit-scrollbar-thumb {\n  background: #1c1f21;\n  -webkit-border-radius: 4px; }\n\n/* line 70, src/scss/_theme.scss */\n[_v-464f561b]::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 6px #282C2F;\n  background: #3f464b;\n  /* margin: 10px 0; */ }\n\n/* line 76, src/scss/_theme.scss */\n[_v-464f561b]::-webkit-scrollbar {\n  width: 12px; }\n\n/* line 81, src/scss/_theme.scss */\n.fade-enter-active[_v-464f561b], .fade-leave-active[_v-464f561b] {\n  transition: opacity .5s; }\n\n/* line 84, src/scss/_theme.scss */\n.fade-enter[_v-464f561b], .fade-leave-to[_v-464f561b] {\n  opacity: 0; }\n\n/* line 88, src/scss/_theme.scss */\n.slide-enter-active[_v-464f561b], .slide-leave-active[_v-464f561b] {\n  transition: all .5s; }\n\n/* line 91, src/scss/_theme.scss */\n.slide-enter[_v-464f561b], .slide-leave-to[_v-464f561b] {\n  opacity: 0;\n  position: relative; }\n\n/* line 95, src/scss/_theme.scss */\n.slide-enter[_v-464f561b] {\n  -webkit-transform: translate(0, 10%);\n          transform: translate(0, 10%); }\n\n/* line 98, src/scss/_theme.scss */\n.slide-leave-to[_v-464f561b] {\n  -webkit-transform: translate(0, -10%);\n          transform: translate(0, -10%); }\n\n/* === Loading Spinner === */\n/* line 104, src/scss/_theme.scss */\n.load-spinner[_v-464f561b] {\n  margin: auto;\n  width: 60px;\n  height: 60px;\n  border-width: 5px;\n  border-style: solid;\n  border-color: #FCE397 #282C2F #282C2F;\n  -o-border-image: initial;\n     border-image: initial;\n  box-sizing: border-box;\n  border-radius: 100%;\n  -webkit-animation: circle-spin 1s infinite linear;\n          animation: circle-spin 1s infinite linear; }\n  /* line 116, src/scss/_theme.scss */\n  .load-spinner.center[_v-464f561b] {\n    position: absolute;\n    top: calc(50% - 60px);\n    left: calc(50% - 60px); }\n  /* line 121, src/scss/_theme.scss */\n  .load-spinner.small[_v-464f561b] {\n    width: 30px;\n    height: 30px;\n    border-width: 2px; }\n\n@-webkit-keyframes circle-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n@keyframes circle-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n/* line 4, stdin */\n.navbar[_v-464f561b] {\n  background: url(img/bg.png);\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4); }\n  /* line 7, stdin */\n  .navbar .navbar-brand[_v-464f561b] {\n    color: #FCE397;\n    font-family: \"Cricket\"; }\n    /* line 10, stdin */\n    .navbar .navbar-brand span[_v-464f561b] {\n      font-size: 0.55rem;\n      color: #616161; }\n  /* line 16, stdin */\n  .navbar .navbar-nav .nav-item a[_v-464f561b] {\n    color: #fff; }\n  /* line 20, stdin */\n  .navbar #searchResult[_v-464f561b] {\n    z-index: 3;\n    position: absolute;\n    background: #282C2F;\n    padding: 3px 10px;\n    right: 1rem;\n    border: 3px solid #3f464b;\n    outline: 1px solid #576066;\n    top: 3.5rem;\n    min-width: 230px;\n    overflow-y: auto;\n    max-height: 500px; }\n    /* line 32, stdin */\n    .navbar #searchResult ul[_v-464f561b] {\n      -webkit-box-flex: 1;\n          -ms-flex-positive: 1;\n              flex-grow: 1;\n      padding: 0 10px;\n      list-style: none; }\n    /* line 37, stdin */\n    .navbar #searchResult .header[_v-464f561b] {\n      font-weight: bold;\n      border-bottom: 1px solid #3f464b;\n      margin-top: 7px;\n      margin-bottom: 2px;\n      color: #a3a3a3;\n      display: block; }\n      /* line 44, stdin */\n      .navbar #searchResult .header-2[_v-464f561b] {\n        text-align: center; }\n    /* line 48, stdin */\n    .navbar #searchResult .header[_v-464f561b]:first-child {\n      margin-top: 0; }\n    /* line 51, stdin */\n    .navbar #searchResult .item[_v-464f561b] {\n      cursor: pointer;\n      transition: 0.2s;\n      padding: 2px 4px;\n      max-width: 300px;\n      overflow: hidden;\n      white-space: nowrap;\n      text-overflow: ellipsis;\n      border-radius: 2px;\n      color: #d6d6d6; }\n      /* line 61, stdin */\n      .navbar #searchResult .item[_v-464f561b]:hover {\n        background: #3f464b; }\n      /* line 64, stdin */\n      .navbar #searchResult .item span[_v-464f561b] {\n        font-size: .8rem;\n        margin-top: -2px;\n        display: block; }\n")



























































































































































































































































































const Mixins = require('../Mixin');

const emitter = require('../emitter'),
      Sources = require('../sources'),
      repos = require('../js/repos');

module.exports = {
    mixins: [Mixins.selectItem],
    props: ['allanime', 'all_manga'],
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
            setTimeout(() => { 
                this.search = '';
                this.searchOnline_anime = [];
                this.searchOnline_manga = [];
            }, 150)
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
}

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<nav class=\"navbar fixed-top mb-2 navbar-expand-sm\" _v-464f561b=\"\">\n    <a class=\"navbar-brand\" href=\"#\" @click=\"start_page\" _v-464f561b=\"\">Anime List 3.0 <span _v-464f561b=\"\">v{{appVersion}}</span></a>\n    <div class=\"collapse navbar-collapse\" id=\"navbarNav\" _v-464f561b=\"\">\n        <ul class=\"navbar-nav\" _v-464f561b=\"\">\n            <li class=\"nav-item\" v-for=\"item in nav\" _v-464f561b=\"\">\n                <a href=\"#\" class=\"nav-link\" @click=\"change_page(item.page)\" _v-464f561b=\"\">{{item.name}} <b-badge pill=\"\" variant=\"success\" _v-464f561b=\"\">{{item.badge}}</b-badge></a>\n            </li>\n        </ul>\n    </div>\n    <form class=\"form-inline\" _v-464f561b=\"\">\n        <!-- @blur=\"clear\" @input=\"onlineSearch\" -->\n        <input class=\"form-control\" type=\"text\" placeholder=\"Поиск\" aria-label=\"Search\" v-model=\"search\" @input=\"onlineSearch\" @blur=\"clear\" _v-464f561b=\"\">\n    </form>\n    <transition name=\"fade\" _v-464f561b=\"\">\n        <div id=\"searchResult\" v-show=\"search.length\" _v-464f561b=\"\">\n            <span class=\"header\" _v-464f561b=\"\">Локальный поиск:</span>\n            <div class=\"d-flex\" _v-464f561b=\"\">\n                <ul _v-464f561b=\"\">\n                    <li class=\"header header-2\" _v-464f561b=\"\">Аниме</li>\n                    <li class=\"item\" v-for=\"item in searchLocal_anime\" @click=\"select_anime(item)\" _v-464f561b=\"\">{{ item.russian }}<br _v-464f561b=\"\"><span _v-464f561b=\"\">{{ item.name }}</span></li>\n                    <li v-if=\"searchLocal_anime.length === 0\" _v-464f561b=\"\">Ничего не найдено</li>\n                </ul>\n                <ul _v-464f561b=\"\">\n                    <li class=\"header header-2\" _v-464f561b=\"\">Манга</li>\n                    <li class=\"item\" v-for=\"item in searchLocal_manga\" @click=\"select_manga(item)\" _v-464f561b=\"\">{{ item.russian }}<br _v-464f561b=\"\"><span _v-464f561b=\"\">{{ item.name }}</span></li>\n                    <li v-if=\"searchLocal_manga.length === 0\" _v-464f561b=\"\">Ничего не найдено</li>\n                </ul>\n                \n            </div>\n            \n            <span class=\"header\" _v-464f561b=\"\">Онлайн поиск:</span>\n            <div class=\"d-flex\" _v-464f561b=\"\">\n                <ul _v-464f561b=\"\">\n                    <li class=\"header header-2\" _v-464f561b=\"\">Аниме</li>\n                    <li v-if=\"oLoading_anime\" _v-464f561b=\"\"><div class=\"load-spinner small\" _v-464f561b=\"\"></div></li>\n                    <li class=\"item\" v-for=\"item in searchOnline_anime\" v-else-if=\"searchOnline_anime.length > 0\" @click=\"select(item)\" _v-464f561b=\"\">\n                        {{ item.russian }}\n                        <span _v-464f561b=\"\">{{ item.name || item.english }}</span>\n                        <span class=\"text-muted\" _v-464f561b=\"\">{{item.source}}</span>\n                    </li>\n                    <li v-else=\"\" _v-464f561b=\"\">Ничего не найдено</li>\n                </ul>\n                <ul _v-464f561b=\"\">\n                    <li class=\"header header-2\" _v-464f561b=\"\">Манга</li>\n                    <li v-if=\"oLoading_manga\" _v-464f561b=\"\"><div class=\"load-spinner small\" _v-464f561b=\"\"></div></li>\n                    <li class=\"item\" v-for=\"item in searchOnline_manga\" v-else-if=\"searchOnline_manga.length > 0\" @click=\"select(item)\" _v-464f561b=\"\">\n                        {{ item.russian }}\n                        <span _v-464f561b=\"\">{{ item.name || item.english }}</span>\n                        <span class=\"text-muted\" _v-464f561b=\"\">{{item.source}}</span>\n                    </li>\n                    <li v-else=\"\" _v-464f561b=\"\">Ничего не найдено</li>\n                </ul>\n            </div>\n        </div>\n    </transition>\n</nav>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.dispose(function () {
    __vueify_insert__.cache["/* line 14, src/scss/_theme.scss */\nbody[_v-464f561b] {\n  background-image: radial-gradient(at top, rgba(255, 255, 255, 0.15), transparent 45%), url(\"../img/bg.png\");\n  font-family: 'Futura';\n  color: #d6d6d6;\n  background-repeat: no-repeat, repeat; }\n\n/* line 20, src/scss/_theme.scss */\n.text-primary[_v-464f561b] {\n  color: #FCE397 !important; }\n\n/* line 23, src/scss/_theme.scss */\n.btn-outline-warning[_v-464f561b] {\n  color: #FCE397;\n  border-color: #FCE397; }\n  /* line 26, src/scss/_theme.scss */\n  .btn-outline-warning[_v-464f561b]:hover {\n    background-color: #f9c834; }\n  /* line 29, src/scss/_theme.scss */\n  .btn-outline-warning.disabled[_v-464f561b] {\n    color: #FCE397; }\n    /* line 31, src/scss/_theme.scss */\n    .btn-outline-warning.disabled[_v-464f561b]:hover {\n      color: #fff; }\n\n/* line 36, src/scss/_theme.scss */\n.form-control[_v-464f561b] {\n  background-color: #282C2F;\n  color: #d6d6d6; }\n  /* line 39, src/scss/_theme.scss */\n  .form-control[_v-464f561b]:focus {\n    background-color: #282C2F;\n    color: #d6d6d6;\n    border-color: #FCE397; }\n\n/* line 45, src/scss/_theme.scss */\n.nav-tabs .nav-link[_v-464f561b] {\n  color: #fff; }\n  /* line 47, src/scss/_theme.scss */\n  .nav-tabs .nav-link.active[_v-464f561b], .nav-tabs .nav-link[_v-464f561b]:hover {\n    background-color: rgba(0, 0, 0, 0.3);\n    color: #FCE397;\n    border-color: transparent;\n    border-bottom: 2px solid #FCE397; }\n  /* line 53, src/scss/_theme.scss */\n  .nav-tabs .nav-link[_v-464f561b]:hover {\n    color: #b3b3b3; }\n\n/* line 58, src/scss/_theme.scss */\nhr[_v-464f561b] {\n  height: 1.5rem;\n  background-image: repeating-linear-gradient(-45deg, rgba(39, 39, 39, 0.45), rgba(39, 39, 39, 0.45) 2px, transparent 2px, transparent 6px);\n  border-top: none; }\n\n/* === Scrollbar === */\n/* line 65, src/scss/_theme.scss */\n[_v-464f561b]::-webkit-scrollbar-thumb {\n  background: #1c1f21;\n  -webkit-border-radius: 4px; }\n\n/* line 70, src/scss/_theme.scss */\n[_v-464f561b]::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 6px #282C2F;\n  background: #3f464b;\n  /* margin: 10px 0; */ }\n\n/* line 76, src/scss/_theme.scss */\n[_v-464f561b]::-webkit-scrollbar {\n  width: 12px; }\n\n/* line 81, src/scss/_theme.scss */\n.fade-enter-active[_v-464f561b], .fade-leave-active[_v-464f561b] {\n  transition: opacity .5s; }\n\n/* line 84, src/scss/_theme.scss */\n.fade-enter[_v-464f561b], .fade-leave-to[_v-464f561b] {\n  opacity: 0; }\n\n/* line 88, src/scss/_theme.scss */\n.slide-enter-active[_v-464f561b], .slide-leave-active[_v-464f561b] {\n  transition: all .5s; }\n\n/* line 91, src/scss/_theme.scss */\n.slide-enter[_v-464f561b], .slide-leave-to[_v-464f561b] {\n  opacity: 0;\n  position: relative; }\n\n/* line 95, src/scss/_theme.scss */\n.slide-enter[_v-464f561b] {\n  -webkit-transform: translate(0, 10%);\n          transform: translate(0, 10%); }\n\n/* line 98, src/scss/_theme.scss */\n.slide-leave-to[_v-464f561b] {\n  -webkit-transform: translate(0, -10%);\n          transform: translate(0, -10%); }\n\n/* === Loading Spinner === */\n/* line 104, src/scss/_theme.scss */\n.load-spinner[_v-464f561b] {\n  margin: auto;\n  width: 60px;\n  height: 60px;\n  border-width: 5px;\n  border-style: solid;\n  border-color: #FCE397 #282C2F #282C2F;\n  -o-border-image: initial;\n     border-image: initial;\n  box-sizing: border-box;\n  border-radius: 100%;\n  -webkit-animation: circle-spin 1s infinite linear;\n          animation: circle-spin 1s infinite linear; }\n  /* line 116, src/scss/_theme.scss */\n  .load-spinner.center[_v-464f561b] {\n    position: absolute;\n    top: calc(50% - 60px);\n    left: calc(50% - 60px); }\n  /* line 121, src/scss/_theme.scss */\n  .load-spinner.small[_v-464f561b] {\n    width: 30px;\n    height: 30px;\n    border-width: 2px; }\n\n@-webkit-keyframes circle-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n@keyframes circle-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n/* line 4, stdin */\n.navbar[_v-464f561b] {\n  background: url(img/bg.png);\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4); }\n  /* line 7, stdin */\n  .navbar .navbar-brand[_v-464f561b] {\n    color: #FCE397;\n    font-family: \"Cricket\"; }\n    /* line 10, stdin */\n    .navbar .navbar-brand span[_v-464f561b] {\n      font-size: 0.55rem;\n      color: #616161; }\n  /* line 16, stdin */\n  .navbar .navbar-nav .nav-item a[_v-464f561b] {\n    color: #fff; }\n  /* line 20, stdin */\n  .navbar #searchResult[_v-464f561b] {\n    z-index: 3;\n    position: absolute;\n    background: #282C2F;\n    padding: 3px 10px;\n    right: 1rem;\n    border: 3px solid #3f464b;\n    outline: 1px solid #576066;\n    top: 3.5rem;\n    min-width: 230px;\n    overflow-y: auto;\n    max-height: 500px; }\n    /* line 32, stdin */\n    .navbar #searchResult ul[_v-464f561b] {\n      -webkit-box-flex: 1;\n          -ms-flex-positive: 1;\n              flex-grow: 1;\n      padding: 0 10px;\n      list-style: none; }\n    /* line 37, stdin */\n    .navbar #searchResult .header[_v-464f561b] {\n      font-weight: bold;\n      border-bottom: 1px solid #3f464b;\n      margin-top: 7px;\n      margin-bottom: 2px;\n      color: #a3a3a3;\n      display: block; }\n      /* line 44, stdin */\n      .navbar #searchResult .header-2[_v-464f561b] {\n        text-align: center; }\n    /* line 48, stdin */\n    .navbar #searchResult .header[_v-464f561b]:first-child {\n      margin-top: 0; }\n    /* line 51, stdin */\n    .navbar #searchResult .item[_v-464f561b] {\n      cursor: pointer;\n      transition: 0.2s;\n      padding: 2px 4px;\n      max-width: 300px;\n      overflow: hidden;\n      white-space: nowrap;\n      text-overflow: ellipsis;\n      border-radius: 2px;\n      color: #d6d6d6; }\n      /* line 61, stdin */\n      .navbar #searchResult .item[_v-464f561b]:hover {\n        background: #3f464b; }\n      /* line 64, stdin */\n      .navbar #searchResult .item span[_v-464f561b] {\n        font-size: .8rem;\n        margin-top: -2px;\n        display: block; }\n"] = false
    document.head.removeChild(__vueify_style__)
  })
  if (!module.hot.data) {
    hotAPI.createRecord("_v-464f561b", module.exports)
  } else {
    hotAPI.update("_v-464f561b", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}