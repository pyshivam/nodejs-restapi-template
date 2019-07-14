require('express-async-errors');
const {User} = require('../../models/user');
const auth = require('../../middleware/auth');
const ResponseError = require('../../errors/err');
const express = require('express');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {

    let user = await User.findOne({_id: req.user._id})
        .select({imei: 0, password: 0, at: 0, rt: 0, cookie: 0, __v: 0});
    if (!user) return res.status(404).json(ResponseError.getNotFound("User not found."));

    res.send(user);
});

module.exports = router;
