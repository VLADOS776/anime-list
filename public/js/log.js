var winston = require('winston'),
    electronConsole = require('winston-electron');

//winston.add(winston.transports.File, { filename: 'logs.log' });

  var logger = new(winston.Logger)({
      transports: [
        new(winston.transports.Console)(),
        new electronConsole({
            level: 'debug'
        })
      /*new(winston.transports.File)({
              filename: 'logs.log'
          })*/
    ]
  });

module.exports = logger;