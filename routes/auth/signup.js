
const bcrypt = require('bcrypt');
const {pick, keys} = require('lodash');
const {User, userModel, validate} = require('../../models/user');
const ResponseError = require('../../errors/err');
const express = require('express');
const logger = require('../../logger/logger');
const router = express.Router();


router.post('/', async (req, res) => {
    const {error} = validate(req.body);

    if (error) return res.status(400).json(ResponseError.getBadRequest('Validation Failed',
        'Validation',
        error.details[0].message));

    let user = await User.findOne()
        .or([{email: req.body.email}, {imei: req.body.imei}])
        .select({email: 1, imei: 1, _id: 0});

    if (user) {
        if (user.email === req.body.email) return res.status(400).json(ResponseError.getBadRequest('Multiple Email Registration',
            'MultiRegistration',
            'Email is already used.'));
        else if (user.imei === req.body.imei) return res.status(400).json(ResponseError.getBadRequest('Multiple Registration',
            'MultiRegistration',
            'Only one registration per device is allowed.'));
    }

    user = new User(pick(req.body, ['fn', 'ln', 'email', 'pwd', 'imei', 'u_type', 'mn', 'address', 'gender', 'zip', 'city', 'ss']));

    const salt = await bcrypt.genSalt(10);
    user.pwd = await bcrypt.hash(user.pwd, salt);
    await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token);
    res.header('at', user.at);
    res.header('rt', user.rt).send(pick(user, keys(userModel)));
    logger.info('Signed Up', {userId: user._id, service: 'signup'});
});

module.exports = router;
