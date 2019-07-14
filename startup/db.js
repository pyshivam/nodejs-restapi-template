const mongoose = require('mongoose');
const logger = require('../logger/logger');

module.exports = function () {
    // mongoose fix all deprecation warnings
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

    // Database connection
    mongoose.connect('mongodb://localhost/template')
        .then(() => logger.info('Connected to MongoDB...'));

};