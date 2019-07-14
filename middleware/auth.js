require('express-async-errors');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user');
const ResponseError = require('../errors/err');
const nanoid = require('nanoid');
const config = require('config');

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    const at = req.header('at');
    if (!token) return res.status(401).json(ResponseError.getAuth('Auth Token Not Found', 401));
    if (!at || at.length !== 10)
        return res.status(401).json(ResponseError.getAuth('Access Token Not Found or Invalid', 401));

    req.user = jwt.verify(token, config.get('jwtPrivateKey'));
    let user = await User.findById({_id: req.user._id})
        .select({cookie: 1, at: 1});
    if (at !== user.at)
        return res.status(401).json(ResponseError.getAuth('Access Token Expired.', 401));
    if (req.user.c !== user.cookie)
        return res.status(401).json(ResponseError.getAuth('Auth Token Expired.', 401));

    user.at = nanoid(10);
    res.header('x-auth-token', req.header('x-auth-token'));
    res.header('at', user.at);

    await user.save();
    next();

};