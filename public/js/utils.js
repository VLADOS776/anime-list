const request = require('request');

module.exports = {
    loadURLWithReferer(url, referer, callback) {
        request({ url: url, headers: { 'Referer': referer } }, callback);
    }
}