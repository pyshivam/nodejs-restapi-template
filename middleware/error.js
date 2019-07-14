const logger = require('../logger/logger');

module.exports = function (err, req, res, next) {
    res.status(500).json({error: err.message});
    return logger.error(err.message, {service: 'express'}, err);
};
