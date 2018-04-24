<template>
    <div>
        <nav class="navbar fixed-top mb-2 navbar-expand-sm">
            <a class="navbar-brand" href="#" @click="start_page">Anime List 3.0 <span>v{{appVersion}}</span></a>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item" v-for='item in nav' :data-page="item.page" :class="{'active': $root.$children[0].currentPage === item.page}" :key="item.name">
                        <a href="#" class="nav-link" @click='change_page(item.page)'>{{item.name}} <b-badge pill variant='success'>{{item.badge}}</b-badge></a>
                    </li>
                </ul>
            </div>
            <form class="form-inline">
                <!-- @blur="clear" @input="onlineSearch" -->
                <input
                    class="form-control"
                    type="text"
                    placeholder="Поиск"
                    aria-label="Search"
                    v-model="search"
                    @input="onlineSearch"
                    @blur="clear"
                    >
            </form>
            <transition name='fade'>
                <div id="searchResult" v-show="search.length">
                    <span class="header">Локальный поиск:</span>
                    <div class="d-flex">
                        <ul>
                            <li class="header header-2">Аниме</li>
                            <li class="item" v-for="item in searchLocal_anime" @click="select_anime(item)">{{ item.russian }}<br><span>{{ item.name }}</span></li>
                            <li v-if="searchLocal_anime.length === 0">Ничего не найдено</li>
                        </ul>
                        <ul>
                            <li class="header header-2">Манга</li>
                            <li class="item" v-for="item in searchLocal_manga" @click="select_manga(item)">{{ item.russian }}<br><span>{{ item.name }}</span></li>
                            <li v-if="searchLocal_manga.length === 0">Ничего не найдено</li>
                        </ul>
                        
                    </div>
                    
                    <span class="header">Онлайн поиск:</span>
                    <div class="d-flex">
                        <ul>
                            <li class="header header-2">Аниме</li>
                            <li v-if="oLoading_anime"><div class='load-spinner small'></div></li>
                            <li class="item" v-for="item in searchOnline_anime" v-else-if="searchOnline_anime.length > 0" @click="select(item)">
                                {{ item.russian }}
                                <span>{{ item.name || item.english }}</span>
                                <span class='text-muted'>{{item.source}}</span>
                            </li>
                            <li v-else>Ничего не найдено</li>
                        </ul>
                        <ul>
                            <li class="header header-2">Манга</li>
                            <li v-if="oLoading_manga"><div class='load-spinner small'></div></li>
                            <li class="item" v-for="item in searchOnline_manga" v-else-if="searchOnline_manga.length > 0"  @click="select(item)">
                                {{ item.russian }}
                                <span>{{ item.name || item.english }}</span>
                                <span class='text-muted'>{{item.source}}</span>
                            </li>
                            <li v-else>Ничего не найдено</li>
                        </ul>
                    </div>
                </div>
            </transition>
        </nav>

        <Loading v-if='globalLoading'></Loading>
    </div>

</template>

<script>
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
</script>

<style lang="scss">
    @import "../scss/_theme";
    @import "../scss/_topbar.scss";
</style>
