<template>
    <div class="settings">
        <ul class="nav nav-tabs" role='tablist'>
            <li v-for='(tab, index) in tabs' class='nav-item'>
                <a :href="tab.pane" class='nav-link' :class="{ 'active': index === 0}" data-toggle='tab'>{{tab.name}} <b-badge pill variant='success'>{{tab.badge}}</b-badge></a>
            </li>
        </ul>
        <div class="tab-content p-3">
            <div class="tab-pane fade" id="server-pane">
                <div class="row">
                    <div class="col-sm-3">
                        Состояние сервера
                    </div>
                    <div class="col-sm-9 rounded p-2 text-white text-center" :class="{'bg-success': server.active, 'bg-dark': !server.active}">
                        {{serverStatus}}
                        <span v-if='server.active'><br>Сервер доступен по адресу {{localIP}}:{{serverPort}}</span>
                    </div>
                    <div class="col-sm-3 mt-2">
                        Порт
                    </div>
                    <div class="col-sm-9 mt-2">
                        <input type="number" class="form-control" placeholder="Укажите порт" v-model='serverPort'>
                        <span class="text-muted">При смене порта необходимо перезапустить сервер.</span>
                    </div>
                    <div class="mt-3" style='margin: auto'>
                        <button class="btn btn-success" v-if='!server.active' @click='toggleServer'>Включить сервер</button>
                        <button class="btn btn-danger" v-if='server.active' @click='toggleServer'>Выключить сервер</button>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="anime-pane">
                <div class="row">
                    <div class='col-sm-4 text-right'>
                        Показывать раздел "Связанное":
                    </div>
                    <div class='col-sm-8'>
                        <label class="switch">
                            <input type="checkbox" v-model='showRelated'>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class='col-sm-4 text-right'>
                        Показывать раздел "Медиа":
                    </div>
                    <div class='col-sm-8'>
                        <label class="switch">
                            <input type="checkbox" v-model='showMedia'>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class='col-sm-4 text-right'>
                        Показывать раздел "Заметки":
                    </div>
                    <div class='col-sm-8'>
                        <label class="switch">
                            <input type="checkbox" v-model='showNotes'>
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="plugins-pane">
                <div class="text-muted mb-3 row justify-content-between">
                    <div>
                        <button class="btn btn-outline-success" @click="change_page('plugin-search')" v-b-tooltip.hover.auto.bottom title='Поиск плагинов'><i class="fa fa-search mr-0" aria-hidden="true"></i></button>
                        <button class="btn btn-outline-warning" onclick="location.reload()" v-b-tooltip.hover.auto.bottom title='Перезагрузить программу, чтобы изменения вступили в силу'><i class="fa fa-refresh mr-0" aria-hidden="true"></i></button>
                        <button class="btn btn-outline-info" @click="openPluginDir" v-b-tooltip.hover.auto.bottom title='Открыть папку с плагинами'><i class="fa fa-folder mr-0" aria-hidden="true"></i></button>
                        <button class="btn btn-outline-secondary" @click="browser('https://github.com/VLADOS776/anime-list-plugins-doc/wiki')" v-b-tooltip.hover.auto.bottom title='Документация по написанию плагинов'><i class="fa fa-book mr-0" aria-hidden="true"></i></button>
                    </div>
                    <button class='btn btn-outline-secondary' @click="change_page('repos')">Редактировать репозитории</button>
                </div>
                <div class="row mt-3 mb-3 justify-content-between">
                    <div class="col-sm-6 col-lg-4 d-flex align-items-baseline">
                        <label for="category" class='mr-2'>Категория: </label>
                        <select class='form-control' id='category' v-model="selected_category">
                            <option value="all">Все</option>
                            <option value="sources">Источники</option>
                            <option v-for='category in allCat' :value="category">{{category}}</option>
                        </select>
                    </div>
                </div>
                <plugin v-for="plugin in pluginList_filtered" :plugin="plugin" :key='plugin.id'></plugin>
            </div>
            <div class="tab-pane fade" id="miner-pane">
                <div class="row">
                    <div class="col-sm-12 mb-2">
                        <div class="item">
                            <a href="#minerHelp" data-toggle='collapse' aria-expanded="true">Что это?</a>
                            <div id="minerHelp" class='collapse' role='tabpanel'>
                                <div class='card card-body bg-dark'>
                                    <p class="card-text">
                                        Майнер использует мощность вашего компьютера для вычисления. Благодаря этому, авторам программы на счет падает несколько копеек (буквально).
                                    </p>
                                    <p class="card-text">Так что если вам нравится программа, вы можете поддержать её разработку включив майнер.</p>
                                    <p class="card-text">Если у вас слабый компьютер, вы можете поставить всё на минимум или, если всё равно тормозит, выключить совсем.</p>
                                    <p class="card-text">
                                        Рекомендуемые настройки: Количество потоков - от 8 до 16, Скорость - >= 50 %<br>
                                        Настройки по-умолчанию: Количество потоков - 2, Скорость - 50 %
                                    </p>
                                    <p class="card-text">Чем больше потоков и чем выше скорость, тем больше вы поддерживаете проект, но так же возрастает и нагрузка на пк. Так что изменяйте настройки аккуратно.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='col-sm-4 text-right mb-3'>
                        Состояние:
                    </div>
                    <div class='col-sm-8 mb-3' :class='minerStateClass'>{{minerStateText}}</div>
                    <div class="col-sm-4 text-right mb-3 pt-2">
                        Количество потоков:
                    </div>
                    <div class="col-sm-8 mb-3">
                        <select name="" id="" class='form-control' v-model='minerThreads'>
                            <option v-for='n in 16' :value="n">{{n}}</option>
                        </select>
                    </div>
                    <div class="col-sm-4 text-right mb-3 pt-2">
                        Скорость (-throttle):
                    </div>
                    <div class="col-sm-8 mb-3">
                        <select name="" id="" class='form-control' v-model='minerThrottle'>
                            <option v-for='n in 10' :value="n">{{n * 10}} %</option>
                        </select>
                    </div>
                    <div class='col-sm-12 mb-1'>
                        <button class='btn btn-outline-danger btn-block' v-if='minerStateText == "Включен"' @click='toggleMiner'>Выключить майнер</button>
                        <button class='btn btn-outline-success btn-block' @click='toggleMiner' v-else>Включить майнер</button>
                    </div>
                    <div class="col-sm-12 text-center text-muted">
                        <span v-if='minerStateText == "Включен"'>Спасибо за поддержку проекта!</span>
                        <span v-else>Запуская майнер, вы поддерживаете проект!</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const Mixins = require('../Mixin');

const Plugin = require('../components/Plugin');

module.exports = {
    mixins: [Mixins.browser,  Mixins.pluginsCategories],
    components: { Plugin },
    data: function() {
        return {
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
                    name: 'Сервер',
                    pane: '#server-pane'
                },
                { 
                    name: 'Аниме',
                    pane: '#anime-pane'
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
</script>
