var winston = require('winston');

winston.add(winston.transports.File, { filename: 'logs.log' });

module.exports = winston;