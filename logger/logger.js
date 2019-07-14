const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label} = format;
const appRoot = require('app-root-path');

const logger = createLogger({
    level: 'info',
    format: combine(
        label({userId: '', service: 'main'}),
        timestamp(),
        format.json()),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs errors (and below) to `errors.log`
        //
        new transports.File({filename: appRoot + '/Logs/errors.log', level: 'error.js.js'}),
        new transports.File({filename: appRoot + '/Logs/combined.log'})
    ],
    exceptionHandlers: [
        new transports.File({filename: appRoot + '/Logs/exceptions.log'})
    ]
});


process.on('unhandledRejection', (ex) => {
    throw ex;
});

module.exports = logger;
