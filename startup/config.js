const config = require('config');

module.exports = function () {
    // Get key for signing the cookie
    if (!config.get('jwtPrivateKey')) {
        throw new Error('girgit_jwtPrivateKey is not defined.');
    }
};