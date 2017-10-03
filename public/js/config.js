var fs = require('fs'),
    path = require('path'),
    app = require('electron').remote.app;

let config = {};
const configFilePath = path.join(app.getPath('userData'), 'config', 'config.json');

function init() {
    try {
        config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    } catch (e) {
        config = {};
    }
}

init();

module.exports.get = function(param, def) {
    def = def == null ? null : def;
    if (!param) return config;
    
    let path = [];
    
    if (param.indexOf('.' !== -1)) {
        path = param.split('.');
    } else {
        path = [param];
    }
    
    let val = config;
    for (let i = 0; i < path.length; i++) {
        if (!val[path[i]]) return def;
        
        val = val[path[i]];
    }
    
    return val;
}

module.exports.set = function(param, val) {
    let path = [];
    let shema = config;
    
    if (param.indexOf('.' !== -1)) {
        path = param.split('.');
    } else {
        path = [param];
    }
    
    for (let i = 0; i < path.length - 1; i++) {
        let elem = path[i];
        if (!shema[elem]) shema[elem] = {};
        shema = shema[elem];
    }
    shema[path[path.length - 1]] = val;
    
    fs.writeFileSync(configFilePath, JSON.stringify(config));
}