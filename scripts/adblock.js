let blocked = require('./blocked');

let allSites = '(' + blocked.join('|') + ')';

let testRegExp = new RegExp(allSites, 'i');

module.exports.isBlocked = function(url) {
    let isAd = false;
    blocked.forEach(function(element) {
        if (url.indexOf(element) !== -1) {
            isAd = true;
        }
    }, this);
    return isAd;
}

module.exports.blockList = blocked;