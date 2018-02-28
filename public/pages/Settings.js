






























































































































































































































































































































const Mixins = require('../Mixin');

const Plugin = require('../components/Plugin');

module.exports = {
    mixins: [Mixins.browser,  Mixins.pluginsCategories],
    components: { Plugin },
    data: function() {
        return {
            animeDropTime: config.get('anime.dropTime', 18),
            animeDropMultiply: config.get('anime.dropTimeMultiply', 1000 * 60 * 60 * 24),
            server: server,
            serverPort: config.get('server.port', 3000),
            localIP: null,
            miner: miner,
            minerThreads: config.get('miner.threads', 2),
            minerThrottle: config.get('miner.throttle', 0.5) * 10,
            selected_category: 'all',
            selected_repo: 'all',
            pluginList: Plugins.getAllPlugins(),
            sourceList: Plugins.getAllSources(),
            tabs: [
                { 
                    name: 'Аниме',
                    pane: '#anime-pane'
                },
                { 
                    name: 'Сервер',
                    pane: '#server-pane'
                },
                { 
                    name: 'Плагины',
                    pane: '#plugins-pane'
                },
                { 
                    name: 'Майнер',
                    pane: '#miner-pane'
                }
            ]
        }
    },
    watch: {
        animeDropTime: function() {
            if (!isNaN(this.animeDropTime)) {
                config.set('anime.dropTime', this.animeDropTime);
            }
        },
        animeDropMultiply: function() {
            config.set('anime.dropTimeMultiply', this.animeDropMultiply);
        },
        serverPort: function() {
            config.set('server.port', parseInt(this.serverPort));
        },
        minerThreads: function() {
            config.set('miner.threads', this.minerThreads);
            this.miner.miner.setNumThreads(this.minerThreads);
        },
        minerThrottle: function() {
            let thorottle = this.minerThrottle / 10;
            config.set('miner.throttle', thorottle);
            this.miner.miner.setThrottle(1-thorottle);
        }
    },
    computed: {
        serverStatus: function() {
            return this.server.active ? 'Включен' : 'Выключен'
        },
        minerStateText: function() {
            return this.miner.miner.isRunning() ? 'Включен' : 'Выключен'
        },
        minerStateClass: function() {
            return this.miner.miner.isRunning() ? 'text-success' : 'text-danger'
        },
        showRelated: {
            get: function() {
                return config.get('anime.showRelated', true);
            },
            set: function(newVal) {
                config.set('anime.showRelated', newVal);
            }
        },
        showMedia: {
            get: function() {
                return config.get('anime.showMedia', true);
            },
            set: function(newVal) {
                config.set('anime.showMedia', newVal);
            }
        },
        showNotes: {
            get: function() {
                return config.get('anime.showNotes', true);
            },
            set: function(newVal) {
                config.set('anime.showNotes', newVal);
            }
        },
        pluginList_filtered: function() {
            let plugins = this.pluginList.filter(plugin => {
                if (this.selected_category !== 'all') {
                    if (!Array.isArray(plugin.opt.category) || !plugin.opt.category.includes(this.selected_category)) {
                        return false
                    }
                }
                return true
            })
            let sources = [];
            if (this.selected_category === 'sources' || this.selected_category === 'all') {
                sources = [].concat(this.sourceList.anime, this.sourceList.manga);

            }
            
            return plugins.concat(sources);
        }
    },
    methods: {
        toggleServer: function() {
            if (!this.server.active) {
                this.server.start();

                ga.event('Server', 'Server on', { clientID: clientID });
            } else {
                this.server.stop();

                ga.event('Server', 'Server off', { clientID: clientID });
            }
        },
        toggleMiner: function() {
            if (miner.miner.isRunning()) {
                miner.stop();
                config.set('miner.autorun', false);

                ga.event('Miner', 'Miner off', { clientID: clientID });
            } else {
                miner.start();
                config.set('miner.autorun', true);

                ga.event('Miner', 'Miner on', { clientID: clientID });
            }
            this.$forceUpdate();
        },
        openPluginDir: function() {
            remote.shell.openItem(remote.app.getPath('userData') + '/plugins');
        },
        change_page: function(page) {
            this.$emit('change_page', page);
        }
    },
    created: function() {
        require('dns').lookup(require('os').hostname(), (err, add, fam) => {
            this.localIP = add;
        })
    },
    mounted: function() {
        let firstTab = $(this.tabs[0].pane).addClass('show active');

        if (repos.updates().length > 0) {
            this.tabs.forEach((item, index) => {
                if (item.pane === '#plugins-pane')
                    this.$set(this.tabs[index], 'badge', repos.updates().length);
            })
        }
    }
}

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"settings\">\n    <ul class=\"nav nav-tabs\" role=\"tablist\">\n        <li v-for=\"(tab, index) in tabs\" :key=\"tab.name\" class=\"nav-item\">\n            <a :href=\"tab.pane\" class=\"nav-link\" :class=\"{ 'active': index === 0}\" data-toggle=\"tab\">{{tab.name}} <b-badge pill=\"\" variant=\"success\">{{tab.badge}}</b-badge></a>\n        </li>\n    </ul>\n    <div class=\"tab-content p-3\">\n        <div class=\"tab-pane fade\" id=\"anime-pane\">\n            <div class=\"row\">\n                <div class=\"col-sm-5 text-right\">\n                    Показывать раздел \"Связанное\":\n                </div>\n                <div class=\"col-sm-7\">\n                    <label class=\"switch\">\n                        <input type=\"checkbox\" v-model=\"showRelated\">\n                        <span class=\"slider round\"></span>\n                    </label>\n                </div>\n                <div class=\"col-sm-5 text-right\">\n                    Показывать раздел \"Медиа\":\n                </div>\n                <div class=\"col-sm-7\">\n                    <label class=\"switch\">\n                        <input type=\"checkbox\" v-model=\"showMedia\">\n                        <span class=\"slider round\"></span>\n                    </label>\n                </div>\n                <div class=\"col-sm-5 text-right\">\n                    Показывать раздел \"Заметки\":\n                </div>\n                <div class=\"col-sm-7\">\n                    <label class=\"switch\">\n                        <input type=\"checkbox\" v-model=\"showNotes\">\n                        <span class=\"slider round\"></span>\n                    </label>\n                </div>\n                <div class=\"col-sm-5 text-right\">\n                    Перемещать аниме в \"Брошено\" через: \n                </div>\n                <div class=\"col-sm-7\">\n                    <div class=\"input-group\" style=\"max-width: 180px\">\n                        <input class=\"form-control\" type=\"number\" v-model=\"animeDropTime\">\n                        <div class=\"input-group-append\">\n                            <select class=\"form-control\" v-model=\"animeDropMultiply\" style=\"width: 110px\">\n                                <option :value=\"1000 * 60 * 60 * 24\">Дней</option>\n                                <option :value=\"1000 * 60 * 60 * 24 * 7\">Недель</option>\n                                <option :value=\"1000 * 60 * 60 * 24 * 30\">Месяцев</option>\n                            </select>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"tab-pane fade\" id=\"server-pane\">\n            <div class=\"row\">\n                <div class=\"col-sm-3\">\n                    Состояние сервера\n                </div>\n                <div class=\"col-sm-9 rounded p-2 text-white text-center\" :class=\"{'bg-success': server.active, 'bg-dark': !server.active}\">\n                    {{serverStatus}}\n                    <span v-if=\"server.active\"><br>Сервер доступен по адресу {{localIP}}:{{serverPort}}</span>\n                </div>\n                <div class=\"col-sm-3 mt-2\">\n                    Порт\n                </div>\n                <div class=\"col-sm-9 mt-2\">\n                    <input type=\"number\" class=\"form-control\" placeholder=\"Укажите порт\" v-model=\"serverPort\">\n                    <span class=\"text-muted\">При смене порта необходимо перезапустить сервер.</span>\n                </div>\n                <div class=\"mt-3\" style=\"margin: auto\">\n                    <button class=\"btn btn-success\" v-if=\"!server.active\" @click=\"toggleServer\">Включить сервер</button>\n                    <button class=\"btn btn-danger\" v-if=\"server.active\" @click=\"toggleServer\">Выключить сервер</button>\n                </div>\n            </div>\n        </div>\n        <div class=\"tab-pane fade\" id=\"plugins-pane\">\n            <div class=\"text-muted mb-3 row justify-content-between\">\n                <div>\n                    <button class=\"btn btn-outline-success\" @click=\"change_page('plugin-search')\" v-b-tooltip.hover.auto.bottom=\"\" title=\"Поиск плагинов\"><i class=\"fa fa-search mr-0\" aria-hidden=\"true\"></i></button>\n                    <button class=\"btn btn-outline-warning\" onclick=\"location.reload()\" v-b-tooltip.hover.auto.bottom=\"\" title=\"Перезагрузить программу, чтобы изменения вступили в силу\"><i class=\"fa fa-refresh mr-0\" aria-hidden=\"true\"></i></button>\n                    <button class=\"btn btn-outline-info\" @click=\"openPluginDir\" v-b-tooltip.hover.auto.bottom=\"\" title=\"Открыть папку с плагинами\"><i class=\"fa fa-folder mr-0\" aria-hidden=\"true\"></i></button>\n                    <button class=\"btn btn-outline-secondary\" @click=\"browser('https://github.com/VLADOS776/anime-list-plugins-doc/wiki')\" v-b-tooltip.hover.auto.bottom=\"\" title=\"Документация по написанию плагинов\"><i class=\"fa fa-book mr-0\" aria-hidden=\"true\"></i></button>\n                </div>\n                <button class=\"btn btn-outline-secondary\" @click=\"change_page('repos')\">Редактировать репозитории</button>\n            </div>\n            <div class=\"row mt-3 mb-3 justify-content-between\">\n                <div class=\"col-sm-6 col-lg-4 d-flex align-items-baseline\">\n                    <label for=\"category\" class=\"mr-2\">Категория: </label>\n                    <select class=\"form-control\" id=\"category\" v-model=\"selected_category\">\n                        <option value=\"all\">Все</option>\n                        <option value=\"sources\">Источники</option>\n                        <option v-for=\"category in allCat\" :value=\"category\">{{category}}</option>\n                    </select>\n                </div>\n            </div>\n            <plugin v-for=\"plugin in pluginList_filtered\" :plugin=\"plugin\" :key=\"plugin.id\"></plugin>\n        </div>\n        <div class=\"tab-pane fade\" id=\"miner-pane\">\n            <div class=\"row\">\n                <div class=\"col-sm-12 mb-2\">\n                    <div class=\"item\">\n                        <a href=\"#minerHelp\" data-toggle=\"collapse\" aria-expanded=\"true\">Что это?</a>\n                        <div id=\"minerHelp\" class=\"collapse\" role=\"tabpanel\">\n                            <div class=\"card card-body bg-dark\">\n                                <p class=\"card-text\">\n                                    Майнер использует мощность вашего компьютера для вычисления. Благодаря этому, авторам программы на счет падает несколько копеек (буквально).\n                                </p>\n                                <p class=\"card-text\">Так что если вам нравится программа, вы можете поддержать её разработку включив майнер.</p>\n                                <p class=\"card-text\">Если у вас слабый компьютер, вы можете поставить всё на минимум или, если всё равно тормозит, выключить совсем.</p>\n                                <p class=\"card-text\">\n                                    Рекомендуемые настройки: Количество потоков - от 8 до 16, Скорость - &gt;= 50 %<br>\n                                    Настройки по-умолчанию: Количество потоков - 2, Скорость - 50 %\n                                </p>\n                                <p class=\"card-text\">Чем больше потоков и чем выше скорость, тем больше вы поддерживаете проект, но так же возрастает и нагрузка на пк. Так что изменяйте настройки аккуратно.</p>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"col-sm-4 text-right mb-3\">\n                    Состояние:\n                </div>\n                <div class=\"col-sm-8 mb-3\" :class=\"minerStateClass\">{{minerStateText}}</div>\n                <div class=\"col-sm-4 text-right mb-3 pt-2\">\n                    Количество потоков:\n                </div>\n                <div class=\"col-sm-8 mb-3\">\n                    <select name=\"\" id=\"\" class=\"form-control\" v-model=\"minerThreads\">\n                        <option v-for=\"n in 16\" :value=\"n\">{{n}}</option>\n                    </select>\n                </div>\n                <div class=\"col-sm-4 text-right mb-3 pt-2\">\n                    Скорость (-throttle):\n                </div>\n                <div class=\"col-sm-8 mb-3\">\n                    <select name=\"\" id=\"\" class=\"form-control\" v-model=\"minerThrottle\">\n                        <option v-for=\"n in 10\" :value=\"n\">{{n * 10}} %</option>\n                    </select>\n                </div>\n                <div class=\"col-sm-12 mb-1\">\n                    <button class=\"btn btn-outline-danger btn-block\" v-if=\"minerStateText == &quot;Включен&quot;\" @click=\"toggleMiner\">Выключить майнер</button>\n                    <button class=\"btn btn-outline-success btn-block\" @click=\"toggleMiner\" v-else=\"\">Включить майнер</button>\n                </div>\n                <div class=\"col-sm-12 text-center text-muted\">\n                    <span v-if=\"minerStateText == &quot;Включен&quot;\">Спасибо за поддержку проекта!</span>\n                    <span v-else=\"\">Запуская майнер, вы поддерживаете проект!</span>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-a134d918", module.exports)
  } else {
    hotAPI.update("_v-a134d918", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}