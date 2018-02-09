

























































































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

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"plugin-search\">\n    <input type=\"text\" class=\"form-control\" v-model=\"query\" placeholder=\"Поиск плагинов...\">\n    <div class=\"row mt-3 mb-3 justify-content-between\">\n        <div class=\"col-sm-6 col-lg-4 d-flex align-items-baseline\">\n            <label for=\"category\" class=\"mr-2\">Категория: </label>\n            <select class=\"form-control\" id=\"category\" v-model=\"selected_category\">\n                <option value=\"all\">Все</option>\n                <option value=\"sources\">Источники</option>\n                <option v-for=\"category in allCat\" :value=\"category\">{{category}}</option>\n            </select>\n        </div>\n        <div class=\"col-sm-6 col-lg-4 d-flex align-items-baseline\">\n            <label for=\"repo\" class=\"mr-2\">Репозиторий: </label>\n            <select id=\"repo\" class=\"form-control\" v-model=\"selected_repo\">\n                <option value=\"all\">Все</option>\n                <option v-for=\"repo in allRepos\" :value=\"repo.name\">{{repo.name}}</option>\n            </select>\n        </div>\n    </div>\n    <div v-if=\"result\">\n        <p>Найдено: {{result.length}}</p>\n        <div class=\"result\">\n            <plugin-in-search v-for=\"plugin in result\" :plugin=\"plugin\" :key=\"plugin.id\"></plugin-in-search>\n        </div>\n    </div>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-92cd54e8", module.exports)
  } else {
    hotAPI.update("_v-92cd54e8", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}