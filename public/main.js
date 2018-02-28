var $ = jQuery = require('./js/libs/jquery-3.2.1.min.js'),
    bootstrap = require('./js/libs/bootstrap.min.js');

var remote = require('electron').remote,
    {dialog} = require('electron').remote,
    {ipcRenderer} = require('electron'),
    fs = require('fs'),
    path = require('path'),
    compareVersions = require('compare-versions');

const Vue = require('../node_modules/vue/dist/vue');
const App = require('./App');
require('./polyfills');

var db = require('./js/db.js'),
    shikimori = require('./js/shikimoriInfo'),
    {anime: animeInfo, manga: mangaInfo} = require('./js/shikimoriInfo'),
    subtitles = require('./js/subtitles'),
    repos = require('./js/repos'),
    Fuse = require('./js/libs/fuse');

var onlineManga = require('./js/onlineManga.js');

const log = require('./js/log'),
      config = require('./js/config'),
      miner = require('./miner'),
      Plugins = require('./plugin'),
      Sources = require('./sources'),
      emitter = require('./emitter');

const server = require('./server');

const Analytics = require('electron-google-analytics').default;
const ga = new Analytics('UA-26654861-22');
const clientID = require("os").userInfo().username;

//var anime = require('animejs');

var DEV = true;

server.on('watched', function(data) {
    let anime = app.$children[0].allAnime.find((anime) => {
        if (data.query.id) {
            return anime.id == data.query.id
        } else if (data.query.name && data.query.source) {
            return anime.name == data.query.name && anime.source == data.query.source
        }
    });
    
    if (anime) {
        anime.watched = data.episode;
        db.anime.watchEp(anime, data.episode);
    } else if (data.query.id) {
        animeInfo.info(data.query.id, (error, anime) => {
            if (anime) {
                db.anime.add(anime, () => {
                    db.anime.watchEp(anime, data.episode);
                    app.$emit('update-all-anime');
                })
            }
        })
    }
})

ipcRenderer.on('adblock', (event, arg) => {
    console.warn(`Ad blocked!`, arg);
})

/* === TODO LIST ===
** TODO: Логин на shikimori и импорт списков.
** TODO: Собирать информацию с разных источников. Для сверки использовать название и год выпуска.
** TODO: Поиск по Shikimori сделать в виде плагинов, установленых по умолчанию
** TODO: Разобраться с главами манги. Нельзя связывать число с главой. Т.к. бывают главы 12.5, 13.1 13.2 13.4 и т.д.
*/

Vue.use(require('bootstrap-vue'));
Vue.use(require('vue-scrollto'));
Vue.use(require('./js/libs/vue-shortkey.js'), { prevent: ['input', 'textarea'] });

var app = new Vue({
    el: '#app',
    render: h => h(App),
    methods: {
        change_page(page) {
            this.$children[0].change_page(page);
        }
    },
    computed: {
        selected: {
            get() {
                return this.$children[0].selected
            },
            set(val) {
                this.$children[0].selected = val;
            }
        },
        App() {
            return this.$children[0]
        }
    }
})

function PluginEvent(event = {}) {
    event.selected = app.$children[0].selected;
    event.page = app.$children[0].currentPage;
    event.vue = {
        app: app.$children[0],
        page: app.$children[0].$children[1]
    }
    Plugins.$event(event);
}