
const winston = require('winston');

const logConfiguration = {
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: '/opt/csye6225.log'
        })
    ]
};

const logger = winston.createLogger(logConfiguration);
module.exports = logger