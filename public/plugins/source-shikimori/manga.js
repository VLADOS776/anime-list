const Shikimori = require('node-shikimori').Shikimori,
      request = require('request'),
      cheerio = require('cheerio');

const config = {
    id: 'source-shikimori-manga',
    name: 'Shikimori Manga',
    description: "Информация о манге с сайта Shikimori",
    author: 'VLADOS776',
    version: '1.0.0',
    type: 'manga',
    source: 'shikimori.org'
}

let client = null;

Shikimori({}, (err, cl) => {
    if (err) {
        log.error(err);
    }
    client = cl;
});

module.exports = function(Plugin) {
    Plugin.newSource(config, {
        search: (query, callback) => {
            client.get('mangas', { search: query, limit: 10 }, function(err, response, body) {
                if (response) {
                    response = response.map(itm => {
                        itm.source = 'shikimori.org';
                        itm.type = 'manga';
                        return itm;
                    })
                }
        
                callback(err, response);
            })
        },
        info: (item, callback) => {
            client.get('mangas/' + item.id, (err, info, res) => {
                if (info) {
                    info.source = 'shikimori.org';
                    info.type = 'manga';
                }

                callback(err, info);
            })
        },
        read: (opt, callback) => {
            let readManga = Plugin.getSource('source-readmanga');
            if (readManga) {
                // Если нажата кнопка читать
                if (!opt.link) {
                    client.get('mangas/' + opt.manga.id + '/external_links', (err, links) => {
                        if (links && links.length) {
                            let rmLink = links.find(link => link.kind === 'readmanga')
    
                            if (rmLink) {
                                readManga.info({ link: rmLink.url }, (err, info) => {
                                    if (info) {
                                        readManga.read({ manga: info, read: opt.read, action: 'chapter'}, callback);
                                    }
                                })
                            }
                        }
                    })
                // Если смена главы
                } else {
                    readManga.read(opt, callback);
                }
            } else {
                // TODO: Уведомление о том, что требуется источник ReadManga
            }
        }
    })
}
