require('express-async-errors');
const {User} = require('../../models/user');
const Joi = require('@hapi/joi');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const ResponseError = require('../../errors/err');
const express = require('express');
const router = express.Router();

// Adding protection
router.use(auth);


// Validating request body
function validateUser(user) {
    const schema = {
        fn: Joi.string().min(5).max(50),
        ln: Joi.string().min(5).max(50),
        zip: Joi.string().min(3).max(10),
        city: Joi.string().min(3).max(30),
        gender: Joi.string().length(1),
        address: Joi.string().min(5).max(1024),
        email: Joi.string().min(5).max(255).email(),
        mn: Joi.string().length(10).regex(/^\d+$/),
    };

    return Joi.validate(user, schema);
}


router.patch('/profile', async (req, res) => {

    // validation of request
    const {error} = validateUser(req.body);
    if (error) return res.status(400).json(ResponseError.getBadRequest('Validation Failed',
        'Validation',
        error.details[0].message));

    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    const user = await User.findOneAndUpdate(
        {'_id': req.user._id},
        {$set: updateOps},
        {new: true}
    ).select({_id: 0});

    if (!user) return res.status(404).json(ResponseError.getNotFound("User not found."));

    res.send(user);


});


router.patch('/profile/image', upload().single('avatar'), async (req, res) => {
    const user = await User.findOneAndUpdate(
        {'_id': req.user._id},
        {$set: {'avatar': req.file.filename}},
        {new: true}
    ).select({_id: 0});

    if (!user) return res.status(404).json(ResponseError.getNotFound("User not found."));

    return res.send();

});


module.exports = router;
