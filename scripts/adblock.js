let blocked = require('./blocked');

module.exports.isBlocked = function(url) {
    let isAd = false;
    blocked.forEach(function(element) {
        if (url.indexOf(element) !== -1) {
            isAd = true;
        }
    }, this);
    return isAd;
}

module.exports.addFilter = function(filter) {
    blocked.push(filter);
    return true;
}

module.exports.addFilters = function(filterArr) {
    blocked = blocked.concat(filterArr);
    return true;
}

module.exports.blockList = function() {
    return blocked;
}