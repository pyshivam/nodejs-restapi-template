require('express-async-errors');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const ResponseError = require('../../errors/err');
const {User, userModel} = require('../../models/user');
const express = require('express');
const nanoid = require('nanoid');
const logger = require('../../logger/logger');
const router = express.Router();


function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        pwd: Joi.string().min(5).max(255).required(),
        imei: Joi.string().min(14).max(14).regex(/^\d+$/).required(),
    };

    return Joi.validate(req, schema);
}


// Login for new devices or device which doesn't have JWT Cookie
router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error)
        return res.status(400).json(ResponseError.getBadRequest('Validation Failed',
            'Validation',
            error.details[0].message));

    let user = await User.findOne({email: req.body.email})
        .select({imei: 0});
    if (!user) return res.status(400).json(ResponseError.getBadRequest('Login Failed',
        'Login',
        'Invalid email or password.'));


    const validPassword = await bcrypt.compare(req.body.pwd, user.pwd);
    if (!validPassword){
        console.log(validPassword);

        return res.status(400).json(ResponseError.getBadRequest('Login Failed',
            'Login',
            'Invalid email or password.'));

    }


    user.at = nanoid(10);
    user.rt = nanoid(10);
    await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token);
    res.header('at', user.at);
    res.header('rt', user.rt);

    res.json(_.pick(user, _.keys(userModel)));
    logger.info('Logged In', {userId: user._id, service: 'login'});
});


module.exports = router;
