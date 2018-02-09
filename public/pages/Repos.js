





















































































module.exports = {
    data: function() {
        return {
            reposInfo: [],
            error: null,
            repoUrl: '',
            allRepos: []
        }
    },
    methods: {
        modalShown: function() {
            this.repoUrl = '';
            this.$refs.url.focus();
        },
        handleOk: function(evt) {
            evt.preventDefault();
            if (this.repoUrl) {
                this.submit()
            }
        },
        submit: function() {
            this.$refs.modal.hide();
            repos.addRepo(this.repoUrl)
                .then((repo) => {
                    this.updateRepos();
                })
                .catch(err => {
                    if (err) {
                        this.error = err;
                    }
                });
            this.repoUrl = '';
        },
        updateRepos: function() {
            this.allRepos = repos.getAllReposInfo();
        },
        remove: function(link) {
            repos.remove(link);

            this.updateRepos();
        }
    },
    mounted: function() {
        this.updateRepos();
    }
}

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div id=\"repos\">\n    <b-alert variant=\"danger\" :show=\"error != null\" dismissible=\"\" @dismissed=\"error=null\">{{error}}</b-alert>\n    <div class=\"row mb-3\">\n        <button class=\"btn btn-outline-success\" v-b-modal.add-repo-modal=\"\">Добавить репозиторий</button>\n    </div>\n    <div class=\"row mb-4 repo\" v-for=\"repo in allRepos\">\n        <div class=\"col-sm-10\">\n            <h5 class=\"repo__name\">{{repo.name}}</h5>\n            <div class=\"repo__description\">{{repo.description}}</div>\n            <small class=\"text-muted\">{{repo.link}}</small>\n        </div>\n        <div class=\"col-sm-2\">\n            <button class=\"btn btn-outline-danger\" @click=\"remove(repo.link)\"><i class=\"fa fa-trash mr-0\" aria-hidden=\"true\"></i></button>\n        </div>\n    </div>\n\n    <!-- Modal -->\n    <b-modal id=\"add-repo-modal\" ref=\"modal\" title=\"Введите адрес репозитория\" cancel-title=\"Отмена\" ok-title=\"Добавить\" @ok=\"handleOk\" @shown=\"modalShown\" header-bg-variant=\"dark\" header-text-variant=\"light\" body-bg-variant=\"dark\" footer-bg-variant=\"dark\">\n\n        <form @submit.stop.prevent=\"submit\">\n            <b-form-input type=\"text\" ref=\"url\" placeholder=\"URL адрес репозитория\" v-model=\"repoUrl\"></b-form-input>\n        </form>\n    </b-modal>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-7386a1c0", module.exports)
  } else {
    hotAPI.update("_v-7386a1c0", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}