var __vueify_insert__ = require("vueify/lib/insert-css")
var __vueify_style__ = __vueify_insert__.insert("/* line 2, stdin */\nbody.overflow {\n  overflow: hidden; }\n\n/* line 6, stdin */\n.screensVideo .media-item-wrap {\n  display: inline-block; }\n  /* line 8, stdin */\n  .screensVideo .media-item-wrap .media-content {\n    position: relative;\n    cursor: pointer;\n    opacity: 0.8;\n    transition: 0.2s; }\n    /* line 13, stdin */\n    .screensVideo .media-item-wrap .media-content:hover {\n      opacity: 1; }\n    /* line 16, stdin */\n    .screensVideo .media-item-wrap .media-content > i {\n      position: absolute;\n      left: 50%;\n      top: 50%;\n      font-size: 1.8rem;\n      -webkit-transform: translate(-50%, -50%);\n              transform: translate(-50%, -50%);\n      color: #fff;\n      text-shadow: 0 0 7px rgba(0, 0, 0, 0.5); }\n\n/* line 27, stdin */\n.screensVideo img {\n  max-width: 250px;\n  max-height: 140px;\n  margin-top: .5rem;\n  margin-left: .5rem; }\n\n/* line 34, stdin */\n.screensVideo .modal-mask {\n  z-index: 40;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.8); }\n  /* line 42, stdin */\n  .screensVideo .modal-mask .modal-wrapper {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    height: 100%; }\n    /* line 47, stdin */\n    .screensVideo .modal-mask .modal-wrapper iframe, .screensVideo .modal-mask .modal-wrapper img {\n      margin: auto; }\n    /* line 50, stdin */\n    .screensVideo .modal-mask .modal-wrapper .youtube {\n      width: 70%; }\n    /* line 53, stdin */\n    .screensVideo .modal-mask .modal-wrapper img {\n      max-width: 800px;\n      max-height: 100%; }\n")
























































































































module.exports = {
    props: ['preview', 'full'],
    data: function() {
        return {
            active: false
        }
    },
    methods: {
        open: function() {
            this.active = true;
        },
        hide: function() {
            this.active = false;
        }
    },
    computed: {
        isImage: function() {
            return /\.(jpg|png|gif)/gi.test(this.full);
        },
        previewLink: function() {
            return this.preview.startsWith('/') ? 'https://shikimori.org/'+ this.preview : this.preview;
        },
        fullLink: function() {
            return this.full.startsWith('/') ? 'https://shikimori.org/'+ this.full : this.full;
        }
    },
    watch: {
        active: function(val) {
            if (val) {
                document.body.classList.add('overflow');
            } else {
                document.body.classList.remove('overflow');
            }
        }
    }
}

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"media-item-wrap\">\n    <div class=\"modal-mask\" @click=\"active=false\" v-if=\"active\">\n        <div class=\"modal-wrapper\">\n            <img :src=\"fullLink\" alt=\"\" v-if=\"isImage\">\n            <div class=\"youtube embed-responsive embed-responsive-16by9\" v-else=\"\">\n                <iframe class=\"embed-responsive-item\" :src=\"fullLink\" allowfullscreen=\"\"></iframe>\n            </div>\n        </div>\n    </div>\n    <div class=\"media-content\" v-if=\"isImage\" @click=\"active=true\">\n        <i class=\"fa fa-search-plus\" aria-hidden=\"true\"></i>\n        <img :src=\"previewLink\" alt=\"\">\n    </div>\n    <div class=\"media-content\" v-else=\"\" @click=\"active=true\">\n        <i class=\"fa fa-youtube-play\" aria-hidden=\"true\"></i>\n        <img :src=\"previewLink\" alt=\"\">\n    </div>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.dispose(function () {
    __vueify_insert__.cache["/* line 2, stdin */\nbody.overflow {\n  overflow: hidden; }\n\n/* line 6, stdin */\n.screensVideo .media-item-wrap {\n  display: inline-block; }\n  /* line 8, stdin */\n  .screensVideo .media-item-wrap .media-content {\n    position: relative;\n    cursor: pointer;\n    opacity: 0.8;\n    transition: 0.2s; }\n    /* line 13, stdin */\n    .screensVideo .media-item-wrap .media-content:hover {\n      opacity: 1; }\n    /* line 16, stdin */\n    .screensVideo .media-item-wrap .media-content > i {\n      position: absolute;\n      left: 50%;\n      top: 50%;\n      font-size: 1.8rem;\n      -webkit-transform: translate(-50%, -50%);\n              transform: translate(-50%, -50%);\n      color: #fff;\n      text-shadow: 0 0 7px rgba(0, 0, 0, 0.5); }\n\n/* line 27, stdin */\n.screensVideo img {\n  max-width: 250px;\n  max-height: 140px;\n  margin-top: .5rem;\n  margin-left: .5rem; }\n\n/* line 34, stdin */\n.screensVideo .modal-mask {\n  z-index: 40;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.8); }\n  /* line 42, stdin */\n  .screensVideo .modal-mask .modal-wrapper {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    height: 100%; }\n    /* line 47, stdin */\n    .screensVideo .modal-mask .modal-wrapper iframe, .screensVideo .modal-mask .modal-wrapper img {\n      margin: auto; }\n    /* line 50, stdin */\n    .screensVideo .modal-mask .modal-wrapper .youtube {\n      width: 70%; }\n    /* line 53, stdin */\n    .screensVideo .modal-mask .modal-wrapper img {\n      max-width: 800px;\n      max-height: 100%; }\n"] = false
    document.head.removeChild(__vueify_style__)
  })
  if (!module.hot.data) {
    hotAPI.createRecord("_v-6b2dafd7", module.exports)
  } else {
    hotAPI.update("_v-6b2dafd7", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}