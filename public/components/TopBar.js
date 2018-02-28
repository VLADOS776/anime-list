var __vueify_insert__ = require("vueify/lib/insert-css")
var __vueify_style__ = __vueify_insert__.insert("/* line 14, src/scss/_theme.scss */\nbody {\n  background-image: radial-gradient(at top, rgba(255, 255, 255, 0.15), transparent 45%), url(\"img/bg.png\");\n  font-family: 'Futura';\n  color: #d6d6d6;\n  background-repeat: no-repeat, repeat; }\n\n/* line 20, src/scss/_theme.scss */\n.text-primary {\n  color: #FCE397 !important; }\n\n/* line 23, src/scss/_theme.scss */\n.btn-outline-warning {\n  color: #FCE397;\n  border-color: #FCE397; }\n  /* line 26, src/scss/_theme.scss */\n  .btn-outline-warning:hover {\n    background-color: #f9c834; }\n  /* line 29, src/scss/_theme.scss */\n  .btn-outline-warning.disabled {\n    color: #FCE397; }\n    /* line 31, src/scss/_theme.scss */\n    .btn-outline-warning.disabled:hover {\n      color: #fff; }\n\n/* line 36, src/scss/_theme.scss */\n.form-control {\n  background-color: #282C2F;\n  color: #d6d6d6; }\n  /* line 39, src/scss/_theme.scss */\n  .form-control:focus {\n    background-color: #282C2F;\n    color: #d6d6d6;\n    border-color: #FCE397; }\n\n/* line 45, src/scss/_theme.scss */\n.nav-tabs .nav-link {\n  color: #fff; }\n  /* line 47, src/scss/_theme.scss */\n  .nav-tabs .nav-link.active, .nav-tabs .nav-link:hover {\n    background-color: rgba(0, 0, 0, 0.3);\n    color: #FCE397;\n    border-color: transparent;\n    border-bottom: 2px solid #FCE397; }\n  /* line 53, src/scss/_theme.scss */\n  .nav-tabs .nav-link:hover {\n    color: #b3b3b3; }\n\n/* line 58, src/scss/_theme.scss */\nhr {\n  height: 1.5rem;\n  background-image: repeating-linear-gradient(-45deg, rgba(39, 39, 39, 0.45), rgba(39, 39, 39, 0.45) 2px, transparent 2px, transparent 6px);\n  border-top: none; }\n\n/* === Scrollbar === */\n/* line 65, src/scss/_theme.scss */\n::-webkit-scrollbar-thumb {\n  background: #1c1f21;\n  -webkit-border-radius: 4px; }\n\n/* line 70, src/scss/_theme.scss */\n::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 6px #282C2F;\n  background: #3f464b;\n  /* margin: 10px 0; */ }\n\n/* line 76, src/scss/_theme.scss */\n::-webkit-scrollbar {\n  width: 12px; }\n\n/* line 81, src/scss/_theme.scss */\n.fade-enter-active, .fade-leave-active {\n  transition: opacity .5s; }\n\n/* line 84, src/scss/_theme.scss */\n.fade-enter, .fade-leave-to {\n  opacity: 0; }\n\n/* line 88, src/scss/_theme.scss */\n.slide-enter-active, .slide-leave-active {\n  transition: all .5s; }\n\n/* line 91, src/scss/_theme.scss */\n.slide-enter, .slide-leave-to {\n  opacity: 0;\n  position: relative; }\n\n/* line 95, src/scss/_theme.scss */\n.slide-enter {\n  -webkit-transform: translate(0, 10%);\n          transform: translate(0, 10%); }\n\n/* line 98, src/scss/_theme.scss */\n.slide-leave-to {\n  -webkit-transform: translate(0, -10%);\n          transform: translate(0, -10%); }\n\n/* === Loading Spinner === */\n/* line 104, src/scss/_theme.scss */\n.load-spinner {\n  margin: auto;\n  width: 60px;\n  height: 60px;\n  border-width: 5px;\n  border-style: solid;\n  border-color: #FCE397 #282C2F #282C2F;\n  -o-border-image: initial;\n     border-image: initial;\n  box-sizing: border-box;\n  border-radius: 100%;\n  -webkit-animation: circle-spin 1s infinite linear;\n          animation: circle-spin 1s infinite linear; }\n  /* line 116, src/scss/_theme.scss */\n  .load-spinner.center {\n    position: absolute;\n    top: calc(50% - 60px);\n    left: calc(50% - 60px); }\n  /* line 121, src/scss/_theme.scss */\n  .load-spinner.small {\n    width: 30px;\n    height: 30px;\n    border-width: 2px; }\n\n@-webkit-keyframes circle-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n@keyframes circle-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n/* line 1, src/scss/_topbar.scss */\n.navbar {\n  background: url(img/bg.png);\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4); }\n  /* line 4, src/scss/_topbar.scss */\n  .navbar .navbar-brand {\n    color: #FCE397;\n    font-family: \"Cricket\"; }\n    /* line 7, src/scss/_topbar.scss */\n    .navbar .navbar-brand span {\n      font-size: 0.55rem;\n      color: #616161; }\n  /* line 14, src/scss/_topbar.scss */\n  .navbar .navbar-nav .nav-item.active {\n    box-shadow: 0 2px 0px #fce397; }\n  /* line 17, src/scss/_topbar.scss */\n  .navbar .navbar-nav .nav-item a {\n    color: #fff; }\n  /* line 22, src/scss/_topbar.scss */\n  .navbar #searchResult {\n    z-index: 3;\n    position: absolute;\n    background: #282C2F;\n    padding: 3px 10px;\n    right: 1rem;\n    border: 3px solid #3f464b;\n    outline: 1px solid #576066;\n    top: 3.5rem;\n    min-width: 230px;\n    overflow-y: auto;\n    max-height: 500px; }\n    /* line 34, src/scss/_topbar.scss */\n    .navbar #searchResult ul {\n      -webkit-box-flex: 1;\n          -ms-flex-positive: 1;\n              flex-grow: 1;\n      padding: 0 10px;\n      list-style: none; }\n    /* line 39, src/scss/_topbar.scss */\n    .navbar #searchResult .header {\n      font-weight: bold;\n      border-bottom: 1px solid #3f464b;\n      margin-top: 7px;\n      margin-bottom: 2px;\n      color: #a3a3a3;\n      display: block; }\n      /* line 46, src/scss/_topbar.scss */\n      .navbar #searchResult .header-2 {\n        text-align: center; }\n    /* line 50, src/scss/_topbar.scss */\n    .navbar #searchResult .header:first-child {\n      margin-top: 0; }\n    /* line 53, src/scss/_topbar.scss */\n    .navbar #searchResult .item {\n      cursor: pointer;\n      transition: 0.2s;\n      padding: 2px 4px;\n      max-width: 300px;\n      overflow: hidden;\n      white-space: nowrap;\n      text-overflow: ellipsis;\n      border-radius: 2px;\n      color: #d6d6d6; }\n      /* line 63, src/scss/_topbar.scss */\n      .navbar #searchResult .item:hover {\n        background: #3f464b; }\n      /* line 66, src/scss/_topbar.scss */\n      .navbar #searchResult .item span {\n        font-size: .8rem;\n        margin-top: -2px;\n        display: block; }\n")




































































































































































































































const Mixins = require('../Mixin');

const emitter = require('../emitter'),
      Sources = require('../sources'),
      repos = require('../js/repos');

const Loading = require('../components/Loading');

module.exports = {
    mixins: [Mixins.selectItem],
    props: ['allanime', 'all_manga'],
    components: { Loading },
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
            ],
            globalLoading: false
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
                keys: [ "name", "english", "russian" ]
            };
            
            // Ждем, пока пользователь наберет весь запрос
            this.onlineSearchTimeout = setTimeout(function() {
                if (self.search === '') return;
                
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
            let loadingPageTimeout = setTimeout(_ => {
                this.globalLoading = true;
            }, 300);
            Sources.info(item, (err, info) => {
                clearTimeout(loadingPageTimeout);

                if (this.globalLoading) {
                    setTimeout(_ => {
                        this.globalLoading = false;
                    }, 100)
                }
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
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div>\n    <nav class=\"navbar fixed-top mb-2 navbar-expand-sm\">\n        <a class=\"navbar-brand\" href=\"#\" @click=\"start_page\">Anime List 3.0 <span>v{{appVersion}}</span></a>\n        <div class=\"collapse navbar-collapse\" id=\"navbarNav\">\n            <ul class=\"navbar-nav\">\n                <li class=\"nav-item\" v-for=\"item in nav\" :data-page=\"item.page\" :class=\"{'active': $root.$children[0].currentPage === item.page}\">\n                    <a href=\"#\" class=\"nav-link\" @click=\"change_page(item.page)\">{{item.name}} <b-badge pill=\"\" variant=\"success\">{{item.badge}}</b-badge></a>\n                </li>\n            </ul>\n        </div>\n        <form class=\"form-inline\">\n            <!-- @blur=\"clear\" @input=\"onlineSearch\" -->\n            <input class=\"form-control\" type=\"text\" placeholder=\"Поиск\" aria-label=\"Search\" v-model=\"search\" @input=\"onlineSearch\" @blur=\"clear\">\n        </form>\n        <transition name=\"fade\">\n            <div id=\"searchResult\" v-show=\"search.length\">\n                <span class=\"header\">Локальный поиск:</span>\n                <div class=\"d-flex\">\n                    <ul>\n                        <li class=\"header header-2\">Аниме</li>\n                        <li class=\"item\" v-for=\"item in searchLocal_anime\" @click=\"select_anime(item)\">{{ item.russian }}<br><span>{{ item.name }}</span></li>\n                        <li v-if=\"searchLocal_anime.length === 0\">Ничего не найдено</li>\n                    </ul>\n                    <ul>\n                        <li class=\"header header-2\">Манга</li>\n                        <li class=\"item\" v-for=\"item in searchLocal_manga\" @click=\"select_manga(item)\">{{ item.russian }}<br><span>{{ item.name }}</span></li>\n                        <li v-if=\"searchLocal_manga.length === 0\">Ничего не найдено</li>\n                    </ul>\n                    \n                </div>\n                \n                <span class=\"header\">Онлайн поиск:</span>\n                <div class=\"d-flex\">\n                    <ul>\n                        <li class=\"header header-2\">Аниме</li>\n                        <li v-if=\"oLoading_anime\"><div class=\"load-spinner small\"></div></li>\n                        <li class=\"item\" v-for=\"item in searchOnline_anime\" v-else-if=\"searchOnline_anime.length > 0\" @click=\"select(item)\">\n                            {{ item.russian }}\n                            <span>{{ item.name || item.english }}</span>\n                            <span class=\"text-muted\">{{item.source}}</span>\n                        </li>\n                        <li v-else=\"\">Ничего не найдено</li>\n                    </ul>\n                    <ul>\n                        <li class=\"header header-2\">Манга</li>\n                        <li v-if=\"oLoading_manga\"><div class=\"load-spinner small\"></div></li>\n                        <li class=\"item\" v-for=\"item in searchOnline_manga\" v-else-if=\"searchOnline_manga.length > 0\" @click=\"select(item)\">\n                            {{ item.russian }}\n                            <span>{{ item.name || item.english }}</span>\n                            <span class=\"text-muted\">{{item.source}}</span>\n                        </li>\n                        <li v-else=\"\">Ничего не найдено</li>\n                    </ul>\n                </div>\n            </div>\n        </transition>\n    </nav>\n\n    <loading v-if=\"globalLoading\"></loading>\n</div>\n\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.dispose(function () {
    __vueify_insert__.cache["/* line 14, src/scss/_theme.scss */\nbody {\n  background-image: radial-gradient(at top, rgba(255, 255, 255, 0.15), transparent 45%), url(\"img/bg.png\");\n  font-family: 'Futura';\n  color: #d6d6d6;\n  background-repeat: no-repeat, repeat; }\n\n/* line 20, src/scss/_theme.scss */\n.text-primary {\n  color: #FCE397 !important; }\n\n/* line 23, src/scss/_theme.scss */\n.btn-outline-warning {\n  color: #FCE397;\n  border-color: #FCE397; }\n  /* line 26, src/scss/_theme.scss */\n  .btn-outline-warning:hover {\n    background-color: #f9c834; }\n  /* line 29, src/scss/_theme.scss */\n  .btn-outline-warning.disabled {\n    color: #FCE397; }\n    /* line 31, src/scss/_theme.scss */\n    .btn-outline-warning.disabled:hover {\n      color: #fff; }\n\n/* line 36, src/scss/_theme.scss */\n.form-control {\n  background-color: #282C2F;\n  color: #d6d6d6; }\n  /* line 39, src/scss/_theme.scss */\n  .form-control:focus {\n    background-color: #282C2F;\n    color: #d6d6d6;\n    border-color: #FCE397; }\n\n/* line 45, src/scss/_theme.scss */\n.nav-tabs .nav-link {\n  color: #fff; }\n  /* line 47, src/scss/_theme.scss */\n  .nav-tabs .nav-link.active, .nav-tabs .nav-link:hover {\n    background-color: rgba(0, 0, 0, 0.3);\n    color: #FCE397;\n    border-color: transparent;\n    border-bottom: 2px solid #FCE397; }\n  /* line 53, src/scss/_theme.scss */\n  .nav-tabs .nav-link:hover {\n    color: #b3b3b3; }\n\n/* line 58, src/scss/_theme.scss */\nhr {\n  height: 1.5rem;\n  background-image: repeating-linear-gradient(-45deg, rgba(39, 39, 39, 0.45), rgba(39, 39, 39, 0.45) 2px, transparent 2px, transparent 6px);\n  border-top: none; }\n\n/* === Scrollbar === */\n/* line 65, src/scss/_theme.scss */\n::-webkit-scrollbar-thumb {\n  background: #1c1f21;\n  -webkit-border-radius: 4px; }\n\n/* line 70, src/scss/_theme.scss */\n::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 6px #282C2F;\n  background: #3f464b;\n  /* margin: 10px 0; */ }\n\n/* line 76, src/scss/_theme.scss */\n::-webkit-scrollbar {\n  width: 12px; }\n\n/* line 81, src/scss/_theme.scss */\n.fade-enter-active, .fade-leave-active {\n  transition: opacity .5s; }\n\n/* line 84, src/scss/_theme.scss */\n.fade-enter, .fade-leave-to {\n  opacity: 0; }\n\n/* line 88, src/scss/_theme.scss */\n.slide-enter-active, .slide-leave-active {\n  transition: all .5s; }\n\n/* line 91, src/scss/_theme.scss */\n.slide-enter, .slide-leave-to {\n  opacity: 0;\n  position: relative; }\n\n/* line 95, src/scss/_theme.scss */\n.slide-enter {\n  -webkit-transform: translate(0, 10%);\n          transform: translate(0, 10%); }\n\n/* line 98, src/scss/_theme.scss */\n.slide-leave-to {\n  -webkit-transform: translate(0, -10%);\n          transform: translate(0, -10%); }\n\n/* === Loading Spinner === */\n/* line 104, src/scss/_theme.scss */\n.load-spinner {\n  margin: auto;\n  width: 60px;\n  height: 60px;\n  border-width: 5px;\n  border-style: solid;\n  border-color: #FCE397 #282C2F #282C2F;\n  -o-border-image: initial;\n     border-image: initial;\n  box-sizing: border-box;\n  border-radius: 100%;\n  -webkit-animation: circle-spin 1s infinite linear;\n          animation: circle-spin 1s infinite linear; }\n  /* line 116, src/scss/_theme.scss */\n  .load-spinner.center {\n    position: absolute;\n    top: calc(50% - 60px);\n    left: calc(50% - 60px); }\n  /* line 121, src/scss/_theme.scss */\n  .load-spinner.small {\n    width: 30px;\n    height: 30px;\n    border-width: 2px; }\n\n@-webkit-keyframes circle-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n@keyframes circle-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n/* line 1, src/scss/_topbar.scss */\n.navbar {\n  background: url(img/bg.png);\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4); }\n  /* line 4, src/scss/_topbar.scss */\n  .navbar .navbar-brand {\n    color: #FCE397;\n    font-family: \"Cricket\"; }\n    /* line 7, src/scss/_topbar.scss */\n    .navbar .navbar-brand span {\n      font-size: 0.55rem;\n      color: #616161; }\n  /* line 14, src/scss/_topbar.scss */\n  .navbar .navbar-nav .nav-item.active {\n    box-shadow: 0 2px 0px #fce397; }\n  /* line 17, src/scss/_topbar.scss */\n  .navbar .navbar-nav .nav-item a {\n    color: #fff; }\n  /* line 22, src/scss/_topbar.scss */\n  .navbar #searchResult {\n    z-index: 3;\n    position: absolute;\n    background: #282C2F;\n    padding: 3px 10px;\n    right: 1rem;\n    border: 3px solid #3f464b;\n    outline: 1px solid #576066;\n    top: 3.5rem;\n    min-width: 230px;\n    overflow-y: auto;\n    max-height: 500px; }\n    /* line 34, src/scss/_topbar.scss */\n    .navbar #searchResult ul {\n      -webkit-box-flex: 1;\n          -ms-flex-positive: 1;\n              flex-grow: 1;\n      padding: 0 10px;\n      list-style: none; }\n    /* line 39, src/scss/_topbar.scss */\n    .navbar #searchResult .header {\n      font-weight: bold;\n      border-bottom: 1px solid #3f464b;\n      margin-top: 7px;\n      margin-bottom: 2px;\n      color: #a3a3a3;\n      display: block; }\n      /* line 46, src/scss/_topbar.scss */\n      .navbar #searchResult .header-2 {\n        text-align: center; }\n    /* line 50, src/scss/_topbar.scss */\n    .navbar #searchResult .header:first-child {\n      margin-top: 0; }\n    /* line 53, src/scss/_topbar.scss */\n    .navbar #searchResult .item {\n      cursor: pointer;\n      transition: 0.2s;\n      padding: 2px 4px;\n      max-width: 300px;\n      overflow: hidden;\n      white-space: nowrap;\n      text-overflow: ellipsis;\n      border-radius: 2px;\n      color: #d6d6d6; }\n      /* line 63, src/scss/_topbar.scss */\n      .navbar #searchResult .item:hover {\n        background: #3f464b; }\n      /* line 66, src/scss/_topbar.scss */\n      .navbar #searchResult .item span {\n        font-size: .8rem;\n        margin-top: -2px;\n        display: block; }\n"] = false
    document.head.removeChild(__vueify_style__)
  })
  if (!module.hot.data) {
    hotAPI.createRecord("_v-464f561b", module.exports)
  } else {
    hotAPI.update("_v-464f561b", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}