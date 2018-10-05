<template>
    <div class="settings">
        <ul class="nav nav-tabs" role='tablist'>
            <li v-for='(tab, index) in tabs' :key="tab.name" class='nav-item'>
                <a :href="tab.pane" class='nav-link' :class="{ 'active': index === 0}" data-toggle='tab'>{{tab.name}} <b-badge pill variant='success'>{{tab.badge}}</b-badge></a>
            </li>
        </ul>
        <div class="tab-content p-3">
            <div class="tab-pane fade" id="anime-pane">
                <div class="row">
                    <div class='col-sm-5 text-right'>
                        Показывать раздел "Связанное":
                    </div>
                    <div class='col-sm-7'>
                        <label class="switch">
                            <input type="checkbox" v-model='showRelated'>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class='col-sm-5 text-right'>
                        Показывать раздел "Медиа":
                    </div>
                    <div class='col-sm-7'>
                        <label class="switch">
                            <input type="checkbox" v-model='showMedia'>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class='col-sm-5 text-right'>
                        Показывать раздел "Заметки":
                    </div>
                    <div class='col-sm-7'>
                        <label class="switch">
                            <input type="checkbox" v-model='showNotes'>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class='col-sm-5 text-right'>
                        Перемещать аниме в "Брошено" через: 
                    </div>
                    <div class='col-sm-7'>
                        <div class="input-group" style='max-width: 180px'>
                            <input class='form-control' type="number" v-model="animeDropTime">
                            <div class="input-group-append">
                                <select class='form-control' v-model="animeDropMultiply" style='width: 110px'>
                                    <option :value="1000 * 60 * 60 * 24">Дней</option>
                                    <option :value="1000 * 60 * 60 * 24 * 7">Недель</option>
                                    <option :value="1000 * 60 * 60 * 24 * 30">Месяцев</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                            <option v-for='category in allCat' :value="category" :key="category">{{category}}</option>
                        </select>
                    </div>
                </div>
                <plugin v-for="plugin in pluginList_filtered" :plugin="plugin" :key='plugin.id'></plugin>
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
            animeDropTime: config.get('anime.dropTime', 18),
            animeDropMultiply: config.get('anime.dropTimeMultiply', 1000 * 60 * 60 * 24),
            server: server,
            serverPort: config.get('server.port', 3000),
            localIP: null,
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
        }
    },
    computed: {
        serverStatus: function() {
            return this.server.active ? 'Включен' : 'Выключен'
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
