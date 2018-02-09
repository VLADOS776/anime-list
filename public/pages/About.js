

















const Mixins = require('../Mixin');

module.exports = {
    mixins: [Mixins.browser],
}

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"about\">\n    <h5>Разработчики</h5>\n    <ul>\n        <li>VLADOS776</li>\n        <li>Dinaki - <a href=\"#\" @click=\"browser('http://patreon.com/dinaki')\">Patreon</a></li>\n    </ul>\n    <a href=\"#\" @click=\"browser('https://vk.com/anime.list')\">Сообщество VK</a>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-38bcac0c", module.exports)
  } else {
    hotAPI.update("_v-38bcac0c", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}