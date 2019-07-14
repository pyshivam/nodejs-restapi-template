const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const nanoid = require('nanoid');

const userSchema = new mongoose.Schema({
    fn: { // first name
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    },

    ln: { // last name
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true

    },

    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
        trim: true

    },

    mn: { // mobile number
        type: String,
        required: true,
        length: 10,
        unique: true,
        trim: true

    },

    address: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        trim: true

    },

    zip: {
        type: String,
        minlength: 3,
        maxlength: 10,
        trim: true

    },

    city: {
        type: String,
        minlength: 3,
        maxlength: 30,
        trim: true
    },

    gender: {
        type: String,
        length: 1,
        trim: true
    },

    avatar: {
        type: String,
        length: 1024,
    },

    pwd: { // password
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1000
    },

    at: { // access token
        type: String,
        default: nanoid(10),
        trim: true
    },

    rt: { // refresh token
        type: String,
        default: nanoid(10),
        trim: true
    },

    cookie: {
        type: String,
        default: nanoid(10),
        trim: true
    },

    imei: {
        type: String,
        required: true,
        minlength: 14,
        maxlength: 14,
        unique: true
    },

    u_type: { // user type
        type: String,
        minlength: 1,
        maxlength: 2,
        required: true
    },

    isTrial: {
        type: Boolean,
        default: true
    }
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id, isTrial: this.isTrial, c: this.cookie}, config.get('jwtPrivateKey'));
};


userSchema.methods.getAccessToken = function (at) {
    if (at === this.at) {
        this.at = nanoid(10);
    }
};


userSchema.methods.getRefreshedAccessToken = function (rt) {
    if (rt === this.rt) {
        this.at = nanoid(10);
    }
};

const User = mongoose.model('User', userSchema);


// Validating request body
function validateUser(user) {
    const schema = {
        fn: Joi.string().min(5).max(50).required(),
        ln: Joi.string().min(5).max(50).required(),
        zip: Joi.string().min(3).max(10),
        pwd: Joi.string().min(5).max(100),
        city: Joi.string().min(3).max(30),
        gender: Joi.string().length(1),
        address: Joi.string().min(5).max(1024),
        email: Joi.string().min(5).max(255).email().required(),
        mn: Joi.string().length(10).regex(/^\d+$/).required(),
        imei: Joi.string().length(14).regex(/^\d+$/).required(),
        u_type: Joi.string().length(1).required(),
    };

    return Joi.validate(user, schema);
}


// Values to send user in response of login
const userModel = {
    "_id": null,
    "fn": null,
    "ln": null,
    "address": null,
    "zip": null,
    "city": null,
    "email": null,
    "isTrial": null,
    "u_type": null,
    "mn": null,
    "gender": null,
};


exports.User = User;
exports.validate = validateUser;
exports.userModel = userModel;