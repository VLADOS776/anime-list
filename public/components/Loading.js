var __vueify_insert__ = require("vueify/lib/insert-css")
var __vueify_style__ = __vueify_insert__.insert("\n.loading-wrap[_v-c8876b22] {\n    position: fixed;\n    width: 100%;\n    height: 100%;\n    background: rgba(0, 0, 0, 0.68);\n    z-index: 100;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    top: 0;\n}\n.fade-enter-active[_v-c8876b22], .fade-leave-active[_v-c8876b22] {\n    transition: opacity .2s;\n}\n.fade-enter[_v-c8876b22], .fade-leave-to[_v-c8876b22] {\n    opacity: 0;\n}\n")
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<transition name=\"fade\" _v-c8876b22=\"\">\n    <div class=\"loading-wrap\" _v-c8876b22=\"\">\n        <div class=\"load-spinner\" _v-c8876b22=\"\"></div>\n    </div>\n</transition>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.dispose(function () {
    __vueify_insert__.cache["\n.loading-wrap[_v-c8876b22] {\n    position: fixed;\n    width: 100%;\n    height: 100%;\n    background: rgba(0, 0, 0, 0.68);\n    z-index: 100;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    top: 0;\n}\n.fade-enter-active[_v-c8876b22], .fade-leave-active[_v-c8876b22] {\n    transition: opacity .2s;\n}\n.fade-enter[_v-c8876b22], .fade-leave-to[_v-c8876b22] {\n    opacity: 0;\n}\n"] = false
    document.head.removeChild(__vueify_style__)
  })
  if (!module.hot.data) {
    hotAPI.createRecord("_v-c8876b22", module.exports)
  } else {
    hotAPI.update("_v-c8876b22", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}