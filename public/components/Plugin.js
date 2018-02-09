var __vueify_insert__ = require("vueify/lib/insert-css")
var __vueify_style__ = __vueify_insert__.insert("/* line 3, stdin */\n.plugin__author {\n  margin-top: -10px;\n  display: block;\n  margin-bottom: .5rem; }\n\n/* line 8, stdin */\n.plugin__icon {\n  float: left;\n  max-width: 70px;\n  margin-right: 1rem;\n  max-height: 70px; }\n")










































































































const Mixins = require('../Mixin');

module.exports = {
    props: ['plugin'],
    mixins: [Mixins.browser],
    data: function() {
        return {
            hasUpdate: false,
            showRefresh: false,
            newVersion: null,
            forThisAppVersion: true
        }
    },
    computed: {
        active: {
            get: function() {
                return config.get('plugins.' + this.plugin.id + '.active', true);
            },
            set: function(val) {
                this.plugin.active = val;
                config.set('plugins.' + this.plugin.id + '.active', val);

                Plugins._setActive(this.plugin.id, val);
                
                if (val) {
                    ga.event('Plugins', 'Turn on', { evLabel: `${this.plugin.name} v${this.plugin.version} (${this.plugin.id})`, clientID: clientID });
                } else {
                    ga.event('Plugins', 'Turn off', { evLabel: `${this.plugin.name} v${this.plugin.version} (${this.plugin.id})`, clientID: clientID });
                }
            }
        },
        icon_src: function() {
            if (this.plugin.opt.icon != null) {
                return path.join(Plugins.pluginsDir(), this.plugin.id, this.plugin.opt.icon)
            } else {
                return null;
            }
        }
    },
    methods: {
        update: function() {
            repos.downloadPlugin(this.newVersion)
            .then(_ => {
                this.hasUpdate = false;
                this.showRefresh = true;
            })
            .catch(err => {
            });
        }
    },
    mounted: function() {
        let update = Plugins.hasUpdate(this.plugin.id);
        if (update.length > 0) {
            this.hasUpdate = true;
            this.newVersion = update[0];
        }

        this.forThisAppVersion = this.plugin.opt['min-version'] != null ? compareVersions(this.plugin.opt['min-version'], remote.app.getVersion()) < 1 : true;
    }
}

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"row mb-4 plugin\">\n    <div class=\"col-sm-10 d-flex align-items-center\">\n        <img v-if=\"icon_src != null\" :src=\"icon_src\" :alt=\"plugin.name + ' icon'\" class=\"plugin__icon\">\n        <div class=\"d-flex flex-column\">\n            <h5 class=\"plugin__name\">{{plugin.name}} <small class=\"plugin__version\">v{{plugin.version}}</small></h5>\n            <small class=\"plugin__author text-muted\">{{plugin.opt.author}}</small>\n            <div class=\"plugin__description\">{{plugin.opt.description}}</div>\n        </div>\n    </div>\n    <div class=\"col-sm-2 text-center\">\n        <template>\n            <label class=\"switch\" v-if=\"forThisAppVersion\">\n                <input type=\"checkbox\" v-model=\"active\">\n                <span class=\"slider round\"></span>\n            </label>\n            <div v-else=\"\" class=\"text-danger\">Обновите программу до версии {{plugin.opt['min-version']}}</div>\n        </template>\n        \n        <template v-if=\"hasUpdate\">\n            <div v-if=\"newVersion.updateProgram\" class=\"text-danger\">Обновите программу до версии {{newVersion['min-version']}}</div>\n            <button class=\"btn btn-outline-success btn-sm btn-block\" @click=\"update\" v-else=\"\">Обновить</button>\n        </template>\n        <button class=\"btn btn-outline-warning btn-sm btn-block\" onclick=\"location.reload()\" v-b-tooltip.hover.auto.bottom=\"\" title=\"Перезагрузить программу, чтобы изменения вступили в силу\" v-if=\"showRefresh\"><i class=\"fa fa-refresh mr-0\" aria-hidden=\"true\"></i></button>        \n    </div>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.dispose(function () {
    __vueify_insert__.cache["/* line 3, stdin */\n.plugin__author {\n  margin-top: -10px;\n  display: block;\n  margin-bottom: .5rem; }\n\n/* line 8, stdin */\n.plugin__icon {\n  float: left;\n  max-width: 70px;\n  margin-right: 1rem;\n  max-height: 70px; }\n"] = false
    document.head.removeChild(__vueify_style__)
  })
  if (!module.hot.data) {
    hotAPI.createRecord("_v-72771c50", module.exports)
  } else {
    hotAPI.update("_v-72771c50", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}