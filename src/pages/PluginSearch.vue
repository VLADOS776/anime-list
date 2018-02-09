<template>
    <div class="plugin-search">
        <input type="text" class="form-control" v-model="query" placeholder="Поиск плагинов...">
        <div class="row mt-3 mb-3 justify-content-between">
            <div class="col-sm-6 col-lg-4 d-flex align-items-baseline">
                <label for="category" class='mr-2'>Категория: </label>
                <select class='form-control' id='category' v-model="selected_category">
                    <option value="all">Все</option>
                    <option value="sources">Источники</option>
                    <option v-for='category in allCat' :value="category">{{category}}</option>
                </select>
            </div>
            <div class="col-sm-6 col-lg-4 d-flex align-items-baseline">
                <label for="repo" class='mr-2'>Репозиторий: </label>
                <select id="repo" class='form-control' v-model="selected_repo">
                    <option value="all">Все</option>
                    <option v-for="repo in allRepos" :value="repo.name">{{repo.name}}</option>
                </select>
            </div>
        </div>
        <div v-if='result'>
            <p>Найдено: {{result.length}}</p>
            <div class="result">
                <plugin-in-search v-for='plugin in result' :plugin='plugin' :key='plugin.id'></plugin-in-search>
            </div>
        </div>
    </div>
</template>

<script>
const PluginInSearch = require('../components/PluginInSearch');

module.exports = {
    components: { PluginInSearch },
    data: function() {
        return {
            query: '',
            result: [],
            analyticsCD: null,
            allRepos: repos.getAllReposInfo(),
            selected_category: 'all',
            selected_repo: 'all',
            allCat: []
        }
    },
    watch: {
        query: function(val) {
            this.search(val);
        },
        selected_category: function() {
            this.search(this.query)
        },
        selected_repo: function() {
            this.search(this.query)
        }
    },
    methods: {
        search: function(query) {
            this.result = repos.search(query);

            if (this.selected_category !== 'all') {
                this.result = this.result.filter(plug => Array.isArray(plug.category) && plug.category.includes(this.selected_category));
            }

            if (this.selected_repo !== 'all') {
                this.result = this.result.filter(plug => plug.repo.name === this.selected_repo);
            }

            if (this.analyticsCD) clearTimeout(this.analyticsCD);

            this.analyticsCD = setTimeout(_ => {
                ga.event('Plugins', 'Search', { evLabel: query, clientID: clientID });
            }, 700)
        }
    },
    mounted: function() {
        this.search();
        this.result.forEach(plug => {
            if (Array.isArray(plug.category)) {
                plug.category.forEach(category => {
                    if (!this.allCat.includes(category) && category !== 'source') {
                        this.allCat.push(category)
                    }
                })
            }
        });
    }
}
</script>

