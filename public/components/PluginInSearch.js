




























































module.exports = {
    props: ['plugin'],
    data: function() {
        return {
            installing: false,
            installed: Plugins.hasPlugin({ id: this.plugin.id }),
            showRefresh: false,
            error: null
        }
    },
    computed: {
        icon_src: function() {
            if (this.plugin.icon != null) {
                return this.plugin.pluginDir + '/' + this.plugin.icon;
            } else {
                return null;
            }
        }
    },
    methods: {
        download: function() {
            this.installign = true;
            repos.downloadPlugin(this.plugin).then(_ => {
                this.installing = false;
                this.installed = true;
                this.showRefresh = true;

                ga.event('Plugins', 'Install', { evLabel: `${this.plugin.name} v${this.plugin.version} (${this.plugin.id})`, clientID: clientID });
            })
            .catch(err => {
                this.installing = false;
                this.installed = false;
                this.error = err;
            })
        }
    }
}

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"plugin row mb-3\">\n    <div class=\"col-sm-10 d-flex align-items-center\">\n        <img v-if=\"icon_src != null\" :src=\"icon_src\" :alt=\"plugin.name + ' icon'\" class=\"plugin__icon\">\n        <div class=\"d-flex flex-column\">\n            <h5 class=\"plugin__name\">{{plugin.name}} <small class=\"plugin__version\">v{{plugin.version}}</small></h5>\n            <small class=\"plugin__author text-muted\">{{plugin.author}}</small>\n            <div class=\"plugin__description\">{{plugin.description}}</div>\n        </div>\n    </div>\n    <div class=\"col-sm-2 text-center\">\n        <template v-if=\"!installed &amp;&amp; !installing\">\n            <div class=\"text-danger\" v-if=\"plugin.updateProgram\">Обновите программу до версии {{plugin['min-version']}}</div>\n            <button class=\"btn btn-outline-success\" @click=\"download\" v-else=\"\">Установить</button>\n        </template>\n        <div class=\"load-spinner\" v-if=\"installing\"></div>\n        <div v-if=\"installed\">Уже установлено</div>\n        <button class=\"btn btn-sm\" onclick=\"location.reload()\" v-if=\"showRefresh\">Перезагрузить</button>\n    </div>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-2d6c091d", module.exports)
  } else {
    hotAPI.update("_v-2d6c091d", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}