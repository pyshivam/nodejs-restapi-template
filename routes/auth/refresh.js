require('express-async-errors');
const jwt = require('jsonwebtoken');
const {User} = require('../../models/user');
const ResponseError = require('../../errors/err');
const nanoid = require('nanoid');
const config = require('config');
const logger = require('../../logger/logger');
const express = require('express');

const router = express.Router();

router.get('/aToken/:rt', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json(ResponseError.getAuth('Auth Token Not Found', 401));
    req.user = jwt.verify(token, config.get('jwtPrivateKey'));

    let user = await User.findById({_id: req.user._id})
        .select({cookie: 1, at: 1, rt: 1});

    if (req.user.c !== user.cookie)
        return res.status(401).json(ResponseError.getAuth('Access Token Expired', 401));
    if (req.params.rt !== user.rt)
        return res.status(401).json(ResponseError.getAuth('Refresh Token Expired', 401));

    user.at = nanoid(10);
    user.rt = nanoid(10);
    user.cookie = nanoid(10);
    await user.save();

    res.header('x-auth-token', user.generateAuthToken());
    res.send({at: user.at, rt: user.rt});
    logger.info('Access Token Refreshed', {userId: user._id, service: 'refresh'});
});

module.exports = router;