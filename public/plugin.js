const path = require('path'),
    fs = require('fs'),
    app = require('electron').remote.app,
    request = require('request'),
    repos = require('./js/repos');

const config = require('./js/config');

const dependenciesPath = {
        'db': path.join(__dirname, '/js/db.js'),
        'log': path.join(__dirname, '/js/log.js'),
        'server': path.join(__dirname, '/server.js'),
        'fuse': path.join(__dirname, 'js', 'libs', 'fuse.js'),
        'vue': path.join(__dirname, 'js', 'libs', 'vue.js')
    }
let pluginList = [],
    sourceList = {
        anime: [],
        manga: []
    },
    vueApp = null;

function Plugin() {
    this.version = '1.1';
}

/**
 * Отправить событие всем плагинам
 * @param {Object} event - Объект события
 * @param {string} event.type - Тип события
 */
Plugin.prototype.$event = function(event) {
    pluginList.forEach((plugin) => {
        if (config.get('plugins.' + plugin.id.replace(/\./g, '-') + '.active', true)) {
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
 * @param {string} [opt.description] - Описание плагина
 * @param {string} [opt.author] - Автор плагина
 * @param {string} [opt.dependencies] - Зависимости плагина
 * @param {Object} plug - Объект плагина
 * @param {Function} [plug.init] - Функция, которая вызывается один раз при загрузке плагина
 * @param {Function} [plug.onEvent] - Функция, которая вызывается при каком-то событии
 * @param {Function} [plug.mount] - Функция, которая вызывается каждый раз при включении плагина
 * @param {Function} [plug.dismount] - Функция, которая вызывается каждый раз при выключении плагина
 */
Plugin.prototype.newPlugin = function(opt, plug) {
    opt = opt || {};
    let sendToPlug = {};
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

    if (config.get('plugins.' + opt.id.replace(/\./g, '-') + '.active', true)) {
        if (typeof plug.init === 'function') plug.init(sendToPlug);
        if (typeof plug.mount === 'function') plug.mount(vueApp);
        plug.$isInit = true;
    } else {
        plug.$isInit = false;
    }
}

/**
 * Создать новый источник информации.
 * Доступно с версии 1.6.0
 * 
 * @param {Object} opt - Параметры источника
 * @param {string} opt.name - Название источника
 * @param {string} opt.id - ID источника
 * @param {string} opt.version - Версия
 * @param {string} opt.type - Тип информации в источнике (anime или manga)
 * @param {string} opt.source - host адерес источника (например 'mysite.com')
 * @param {string} [opt.description] - Описание
 * @param {string} [opt.author] - Автор
 * @param {string} [opt.dependencies] - Зависимости
 * @param {Object} source - Объект источника
 * @param {Function} [source.init] - Функция вызывается при старте программы, если источник активирован
 * @param {Function} [source.search] - Эта функция вызывается, когда пользователь ввел запрос в поиске
 * @param {Function} [source.info] - Эта функция вызывается, когда пользователь выбирает аниме из поиска
 * @param {Function} [source.watch] - Эта функция вызывается, когда пользователь нажимает кнопку "Смотреть"
 */
Plugin.prototype.newSource = function(opt, source) {
    opt = opt || {};
    if (!opt.type || !opt.name || !opt.version || !opt.id) {
        console.error('У источника должны быть заполенны поля: type, name, version, id');
        return;
    }

    if (typeof source !== 'object') {
        console.error('Источник должен быть объектом с функциями');
        return;
    }

    let sendToPlug = {};

    if (Array.isArray(opt.dependencies)) {
        sendToPlug.dependencies = loadDep(opt.dependencies);
    }

    if (!sourceList[opt.type]) {
        sourceList[opt.type] = {};
    }

    source.opt = opt;
    source.name = opt.name;
    source.version = opt.version;
    source.id = opt.id;

    sourceList[opt.type].push(source);

    if (config.get('sources.' + opt.id.replace(/\./g, '-') + '.active', true)) {
        if (typeof source.init === 'function') source.init(sendToPlug);
    }
}

/**
 * Проверка на наличие плагина
 * @param {Object} params - Параметры
 * @param {string} [params.name] - Название плагина
 * @param {string} [params.id] - id плагина
 * @param {string} [params.version] - Версия плагина
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
 * Есть ли источник информации.
 * Доступно с версии 1.6.0
 * 
 * @param {string} type - Тип источника (anime или manga)
 * @param {string} id - ID источника
 * @returns {boolean}
 */
Plugin.prototype.hasSource = function(type, id) {
    if (!sourceList[type]) {
        console.error('Неизвестный тип ' + type);
        return false;
    }

    let filtered = sourceList[type].filter(item => item.id === id);

    return filtered.length > 0;
}

/**
 * Обёртка над require.
 * Доступно с версии 1.6.0
 * 
 * @param {string} name - название модуля
 * @returns {*} - Модуль
 */
Plugin.prototype.require = function(name) {
    let deps = loadDep([name]);
    if (deps[name]) {
        return deps[name]
    } else {
        return null;
    }
}

/**
 * Получить плагин по id.
 * Доступно с версии 1.6.0
 * 
 * @param {string} id - id плагина
 * @returns {(Object|null)} - Плагин
 */
Plugin.prototype.getPlugin = function(id) {
    if (this.hasPlugin({ id: id })) {
        for (let i = 0; i < pluginList.length; i++) {
            if (pluginList[i].id === id) {
                return pluginList[i]
            }
        }
    }
    return null;
}

/**
 * Получить список всех плагинов
 * @returns {array} - Список всех плагинов
 */
Plugin.prototype.getAllPlugins = function() {
    return pluginList;
}

/**
 * Получить список всех источников.
 * Доступно с версии 1.6.0
 * 
 * @returns {array} - Список всех источников
 */
Plugin.prototype.getAllSources = function() {
    return sourceList;
}

/**
 * Загрузить все плагины. Срабатывает при старте программы
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

/**
 * Путь до папки с плагинами
 * @returns {string}
 */
Plugin.prototype.pluginsDir = function() {
    return path.join(app.getPath('userData'), 'plugins');
}

/**
 * Проверка на наличие обновлений
 * @param {string} id - ID плагина
 * @returns {Array} - Массив с плагинами, у которых совпадает id и версия больше, чем у установленного или пустой массив.
 */
Plugin.prototype.hasUpdate = function(id) {
    return repos.updates().filter(el => el.id == id);
}

Plugin.prototype._setApp = function(app) {
    vueApp = app;
}

Plugin.prototype._setActive = function(plugID, status) {
    let plug = pluginList.find(el => el.opt.id === plugID);

    if (plug) {
        if (status) {
            if (!plug.plug.$isInit && typeof plug.plug.init === 'function') {
                plug.plug.init();
                plug.plug.$isInit = true;
            }
            if (typeof plug.plug.mount === 'function') plug.plug.mount(vueApp);
        } else {
            if (typeof plug.plug.demount === 'function') plug.plug.demount(vueApp);
        }
    }
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