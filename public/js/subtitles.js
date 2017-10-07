const fs = require('fs'),
    ass2vtt = require('ass-to-vtt'),
    srt2vtt = require('srt-to-vtt'),
    path = require('path'),
    remote = require('electron').remote;

module.exports = {
    supportedFormats: ['vtt', 'ass', 'srt'],
    subFolderRegEx: /^(?:sub(?:titles)?|суб(?:титры)?)/i,
    episodeRegEx: /[-._ \[]+(?:(?:ep?[ .]?)?(\d{1,3})(?:[_ ]?v\d+)?)+/i,
    /**
     * Ищет в папке субтитры к эпизоду
     * @param {Object} opt - Параметры
     * @param {string} opt.path - Папка, в которой искать
     * @param {number} opt.episode - Номер эпизода
     * @returns {Array} - Массив с объектами субтитров
     */
    searchSubForEp: function(opt) {
        if (!opt.path) {
            console.error('Path is missing!');
            return null;
        }
        if (!opt.episode) {
            console.error('Episode is missing');
            return null;
        }

        let files = this.getAllSubs(opt),
            epSubs = null;

        if (files && files.length) {
            epSubs = files.filter(file => {
                let episode = file.match(this.episodeRegEx);

                if (episode && episode.length) {
                    if (parseInt(episode[1]) === opt.episode) {
                        return true
                    }
                }
                return false;
            })

            if (epSubs && epSubs.length) {
                epSubs = epSubs.map(file => {
                    let format = file.match(/\.(\w{3})$/)[1],
                        path = opt.path + '/' + file;
    
                    return {
                        name: file.replace(/\.\w{3}$/, ''),
                        format: format,
                        path: path.replace(/\\/g, '//'),
                        url: 'file:///' + path,
                        folder: opt.path,
                        episode: opt.episode
                    };
                })
                return epSubs
            } else {
                return [];
            }
        }

        return [];
    },
    /**
     * Ищет папки с субтитрами
     * @param {Object} opt - Параметры
     * @param {string} opt.path - Папка. в которой искать
     * @returns {Array} - Массив строк.
     */
    findSubFolder: function(opt) {
        if (!opt.path) {
            console.error('Path is missing!');
            return null;
        }

        return fs.readdirSync(opt.path)
            .filter(path => {
                return this.subFolderRegEx.test(path)
            })
    },
    /**
     * Ищет субтитры в папке
     * @param {Object} opt - Параметры
     * @param {string} opt.path - Папка, в которой искать
     * @returns {Array} - Массив с объектами субтитров
     */
    getAllSubs: function(opt) {
        if (!opt.path) {
            console.error('Path is missing!');
            return null;
        }

        return fs.readdirSync(opt.path)
                .filter(file => {
                    let isSub = false;
                    this.supportedFormats.forEach(format => {
                        if (file.endsWith('.' + format)) {
                            isSub = true;
                        }
                    })
                    return isSub;
                });
    },
    /**
     * Конвертирует субтитры в формат vtt
     * @param {Object} opt - Параметры
     * @param {string} opt.file - Исходный файл с субтитрами
     * @param {string} opt.outFolder - Папка, куда будет записан конвертированный файл
     * @param {string} opt.outExt - Формат, в который конвертируется (vtt)
     * @param {string} opt.outName - Имя нового файла. По-умолчанию такое же, как и у оригинального файла
     * @param {convertCallback} callback - Callback
     */
    convert: function(opt, callback) {
        let defOpt = {
            outFolder: remote.app.getPath('temp'),
            outExt: 'vtt'
        }

        let config = Object.assign({}, defOpt, opt);
        
        if (!config.file) {
            callback('File not set', {});
            return;
        }

        let originalFile = path.parse(config.file);

        if (!config.outName) {
            config.outName = originalFile.name
        }

        // Если файл уже в нужном формате
        if (originalFile.ext === '.' + config.outExt) {
            callback(null, {
                folder: originalFile.dir,
                format: originalFile.ext.replace(/^\./, ''),
                name: originalFile.name,
                path: config.file,
                url: 'file:///' + config.file
            })
            return;
        }

        let finalPath = path.join(config.outFolder, config.outName + '.' + config.outExt),
            returnObj = {
                folder: config.outFolder,
                format: config.outExt,
                name: config.outName,
                path: finalPath.replace(/\\/g, '/'),
                url: 'file:///' + finalPath.replace(/\\/g, '/')
            }
        
        if (originalFile.ext === '.ass' && config.outExt === 'vtt') {
            let stream = fs.createReadStream(config.file)
                .pipe(ass2vtt())
                .pipe(fs.createWriteStream(finalPath))
            stream.on('finish', () => callback(null, returnObj))
            
        } else if (originalFile.ext === '.srt' && config.outExt === 'vtt') {
            let stream = fs.createReadStream(config.file)
                .pipe(srt2vtt())
                .pipe(fs.createWriteStream(finalPath))
            stream.on('finish', () => callback(null, returnObj))
        }
    }
}

/**
 * @callback convertCallback
 * @param {string} - Ошибка
 * @param {Object} - Объект с конвертированными субтитрами
 */