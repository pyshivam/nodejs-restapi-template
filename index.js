const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const logger = require('./logger/logger');

// Checking all the config are defined

// express app instance  created.
const app = express();

// Making all the routes available
require('./startup/routes')(app);

// Making database connection
require('./startup/db')();

// Getting port to bind on
const port = process.env.PORT || 3000;

// creating server and listening on port
app.listen(port, () => logger.info(`Listening on port ${port}...`));


// Thanks!!
