const path = require('path'),
    fs = require('fs'),
    app = require('electron').remote.app,
    request = require('request'),
    downloadRelease = require('download-github-release');

const config = require('./js/config');

const dependenciesPath = {
        'db': path.join(__dirname, '/js/db.js'),
        'log': path.join(__dirname, '/js/log.js'),
        'server': path.join(__dirname, '/server.js'),
        'adblock': path.join(__dirname, '../scripts', 'adblock.js'),
        'fuse': path.join(__dirname, 'js', 'libs', 'fuse.js'),
        'vue': path.join(__dirname, 'js', 'libs', 'vue.js')
    }
let pluginList = [],
    vueApp = null;

function Plugin() {
    this.version = '1.1';
}

/**
 * Отправить событие всем плагинам
 * @param {Object} event - Объект события
 * @param {string} event.type - Тип события
 * @param {string} event.page - Имя страницы, если событие = openPage
 * @param {string} event.selected - Выбранное аниме или манга
 */
Plugin.prototype.$event = function(event) {
    pluginList.forEach((plugin) => {
        if (config.get('plugins.' + plugin.id + '.active', true)) {
            if (typeof plugin.plug.onEvent === 'function') plugin.plug.onEvent(event);
        }
    })
}
/**
 * Создать новый плагин
 * @param {Object} opt - Параметры плагина
 * @param {string} opt.name - Название плагина
 * @param {string} opt.version - Версия плагина
 * @param {string} opt.id - id плагина. Может состоять из цифр, английских букв и знаков "-", "_"
 * @param {string} [opt.repo] - Ссылка на репозиторий плагина
 * @param {string} [opt.description] - Описание плагина
 * @param {string} [opt.autroh] - Автор плагина
 * @param {string} [opt.dependencies] - Зависимости плагина
 * @param {Object} plug - Объект плагина
 * @param {Function} init - Функция, которая вызывается при загрузке скрипта
 * @param {Function} onEvent - Функция, которая вызывается при каком-то событии
 */
Plugin.prototype.newPlugin = function(opt = {}, plug) {
    let sendToPlug = {}
    if (!opt.name || !opt.version || !opt.id) {
        console.error('У плагина должгы быть заполнены поля: name, version, id');
        return;
    }

    if (this.hasPlugin({ name: opt.name })) {
        console.error('Plugin already exists');
        return;
    }

    if (Array.isArray(opt.dependencies)) {
        sendToPlug.dependencies = loadDep(opt.dependencies);
    }

    sendToPlug.app = vueApp;

    pluginList.push({
        name: opt.name,
        version: opt.version,
        id: opt.id,
        opt: opt,
        plug: plug
    })

    if (config.get('plugins.' + opt.id + '.active', true)) {
        if (typeof plug.init === 'function') plug.init(sendToPlug);
    }
}
/**
 * Проверка на наличие плагина
 * @param {Object} params - Параметры
 * @param {string} [params.name] - Название плагина
 * @param {string} [params.version] - Версия плагина
 * @param {string} [params.repo] - Ссылка на репозиторий
 * @returns {boolean}
 */
Plugin.prototype.hasPlugin = function(params = {}) {
    let exists = false;
    for (let i = 0; i < pluginList.length; i++) {
        Object.keys(params).forEach((param) => {
            if (pluginList[i].opt[param] === params[param]) { // params param pam pam
                exists = true;
            }
        })
    }
    return exists;
}

/**
 * Получить список всех плагинов
 * @returns {array} - Список всех плагинов
 */
Plugin.prototype.getAllPlugins = function() {
    return pluginList;
}

/**
 * Загрузить все плагины
 */
Plugin.prototype.loadAllPlugins = function() {
    let pluginDirPath = path.join(app.getPath('userData'), 'plugins');
    if (!fs.existsSync(pluginDirPath)) {
        fs.mkdirSync(path.join(app.getPath('userData'), 'plugins'))
    }
    let plugins = fs.readdirSync(pluginDirPath);

    let pluginFiles = [];

    plugins.forEach((plugin) => {
        let filePath = path.join(pluginDirPath, plugin);

        if (fs.lstatSync(filePath).isDirectory()) {
            let dirFiles = fs.readdirSync(filePath);

            dirFiles.forEach((file) => {
                let anotherFilePath = path.join(filePath, file);
                if (fs.lstatSync(anotherFilePath).isFile() && anotherFilePath.endsWith('.js')) {
                    pluginFiles.push(anotherFilePath);
                }
            })
        } else if (fs.lstatSync(filePath).isFile() && filePath.endsWith('.js') ) {
            pluginFiles.push(filePath);
        }
    })

    pluginFiles.forEach((file) => {
        require(file)(PluginManager, {
            dir: path.dirname(file),
            file: file
        });
    })
}

Plugin.prototype.pluginsDir = function() {
    return path.join(app.getPath('userData'), 'plugins');
}

Plugin.prototype.search = function(query='') {
    query = 'al3.0-plugin+' + query.replace(/\s/g, '+');
    
    return new Promise((res, rej) => {
        let options = {
            url: 'https://api.github.com/search/repositories?q=' + query,
            headers: {
                'User-Agent': 'Anime List 3.0'
            }
        }

        request(options, function(err, response, body) {
            if (err) {
                console.error(err);
                rej(err);
                return
            }

            let answer = JSON.parse(body);
            res(answer);
        })
    })
}

Plugin.prototype._download = function(owner, repo) {
    return new Promise((resolve, reject) => {
        function filterRelease(release) {
            // Filter out prereleases.
            return release.prerelease === false;
        }
        
        // Define a function to filter assets.
        function filterAsset(asset) {
            // Select assets that contain the string 'windows'.
            return asset.name.match(/\.zip$/);
        }

        downloadRelease(owner, repo, this.pluginsDir(), filterRelease, filterAsset, false)
        .then(function() {
            resolve(true);
        })
        .catch(err => reject(err)); 
    })
}

Plugin.prototype._setApp = function(app) {
    vueApp = app;
}

function loadDep(depList) {
    let plugDep = {};
    try {
        depList.forEach((element) => {
            if (dependenciesPath[element]) {
                plugDep[element] = require(dependenciesPath[element]);
            } else {
                plugDep[element] = require(element);
            }
        });
    } catch (e) {}
    return plugDep;
}

const PluginManager = new Plugin;

module.exports = PluginManager;