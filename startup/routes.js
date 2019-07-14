const express = require('express');
const helmet = require('helmet');
const signup = require('../routes/auth/signup');
const login = require('../routes/auth/login');
const profile = require('../routes/user/profile');
const update = require('../routes/user/update');
const refresh = require('../routes/auth/refresh');
const error = require('../middleware/error');

module.exports = function (app) {
    // Middleware used
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(helmet());

    // All routing is defined here
    app.use('/api/auth/signup', signup);
    app.use('/api/auth/login', login);
    app.use('/api/user/me', profile);
    app.use('/api/user/update', update);
    app.use('/api/refresh/', refresh);

    // handling error
    app.use(error);
};