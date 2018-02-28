;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"load-spinner\"></div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-2307070a", module.exports)
  } else {
    hotAPI.update("_v-2307070a", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}