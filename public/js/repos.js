const request = require('request'),
      path = require('path'),
      app = require('electron').remote.app,
      fs = require('fs'),
      unzip = require('unzip'),
      compareVersions = require('compare-versions');

const config = require('./config'),
      Fuse = require('./libs/fuse'),
      Plugins = require('../plugin'),
      emitter = require('../emitter');

const defaultRepo = {
    name: "Anime List 3.0 Repo",
    description: "Официальный репозиторий Anime List 3.0",
    link: 'https://raw.githubusercontent.com/VLADOS776/anime-list-3.0-repo/master/plugins.json'
}
const fuseConfig = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 200,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [ "name", "description", "author", "id", "repo.name", "repo.description" ]
  };

let ReposPlugins = [],
    updates = [];

module.exports.allPlugins = function() {
    return ReposPlugins;
}

module.exports.updates = function() {
    return updates;
}

module.exports.search = function(query) {
    if (!query) return module.exports.allPlugins();
    let fuse = new Fuse(ReposPlugins, fuseConfig);

    return fuse.search(query);
}

module.exports.getRepo = function(link) {
    return new Promise((res, rej) => {
        request.get({ url: link }, (err, response, body) => {
            if (err) {
                this.error = err;
                return;
            }

            try {
                let repo = JSON.parse(body);

                if (repo.repo && repo.plugins) {
                    repo.repo.link = link;
                    res(repo)
                } else {
                    rej('Нет информации об репозитории или нет списка плагинов.')
                }
            } catch (e) {
                rej(e);
            }
        })
    })
}

module.exports.getAllReposInfo = function() {
    return config.get('repo_list', [defaultRepo]);
}

module.exports.addRepo = function(link) {
    return new Promise((res, rej) => {
        if (module.exports.hasRepo(link)) {
            rej('Этот репозиторий уже есть в списке.');
            return;
        }
        module.exports.getRepo(link)
            .then(function(repo) {
                let allRepos = config.get('repo_list', [defaultRepo]);
    
                allRepos.push(repo.repo);
                config.set('repo_list', allRepos);

                ReposPlugins = ReposPlugins.concat(repo.plugins);
                res(repo);
            })
            .catch(err => {
                rej(err);
            })
    })
}

module.exports.remove = function(link) {
    let allRepos = config.get('repo_list', [defaultRepo]);
    let repo = allRepos.findIndex(el => el.link === link);

    if (repo != -1) {
        allRepos.splice(repo, 1);
        config.set('repo_list', allRepos);

        for (let i = ReposPlugins.length - 1; i >= 0; i--) {
            if (ReposPlugins[i].repo.link === link)
                ReposPlugins.splice(i, 1);
        }
        return true;
    } else {
        return false;
    }
}

module.exports.hasRepo = function(link) {
    let allRepos = config.get('repo_list', [defaultRepo]);

    return allRepos.find(el => el.link === link);
}

module.exports.downloadPlugin = function(plugin) {
    return new Promise((res, rej) => {
        let outputZip = path.join(app.getPath('userData'), 'plugins', `${plugin.id}.zip`),
            outputFolder = path.join(app.getPath('userData'), 'plugins', plugin.id);
        request({ url: plugin.download, encoding: null }, (err, response, body) => {
            if (err) {
                console.log(err);
                rej(err);
            }

            if (response.statusCode !== 200) {
                console.error('Status code !== 200!');
                rej(response.statusMessage)
            }

            fs.writeFile(outputZip, body, function(err) {
                if (err) {
                    console.log(err);
                    rej(err);
                }

                fs.createReadStream(outputZip)
                    .pipe(unzip.Extract({ path: outputFolder }))
                    .on('close', function() {
                        fs.unlinkSync(outputZip);
                        res(true);
                    });
            })
        })
    })
}

function getAllPlugins() {
    let reposDone = {};
    module.exports.getAllReposInfo().forEach(rep => reposDone[rep.link] = false);

    module.exports.getAllReposInfo().forEach(function(repo) {
        let rand = Math.random()
        let link = repo.link;
        if (link.indexOf('?') != -1) 
            link = link + '&rnd=' + rand;
        else
            link = link + '?rnd=' + rand;
        request.get({ url: link }, (err, response, body) => {
            if (err) {
                console.error(err);
            } else {
                try {
                    let repoJSON = JSON.parse(body);

                    if (repoJSON.plugins && repoJSON.plugins.length) {
                        let plugins = repoJSON.plugins.map(el => {
                            el.repo = repo;

                            let tmp = repo.link.split('/');
                            tmp[tmp.length - 1] = el.id;
                            tmp.push(el.id + '-' + el.version + '.zip');
                            el.download = tmp.join('/');

                            if (el['min-version'] && compareVersions(el['min-version'], app.getVersion()) === 1) {
                                el.updateProgram = true;
                            }

                            return el;
                        });

                        ReposPlugins = ReposPlugins.concat(plugins);

                        reposDone[repo.link] = true;

                        if (allDone()) {
                            checkUpdates();
                        }
                    }
                } catch (e) {
                    if (e) console.log(e);
                }
            }
        })
    }, this);

    function allDone() {
        let keys = Object.keys(reposDone);
        for (let i = 0; i < keys.length; i++) {
            if (reposDone[keys[i]] === false) return false;
        }
        return true;
    }
}

function checkUpdates() {
    Plugins.getAllPlugins().forEach(plug => {
        let repoPlug = ReposPlugins.find(el => el.id == plug.id);

        if (repoPlug) {
            if (compareVersions(repoPlug.version, plug.version)) {
                updates.push(repoPlug);
            }
        }

        emitter.global.event('plugins-update-checked');
    })
}

getAllPlugins();