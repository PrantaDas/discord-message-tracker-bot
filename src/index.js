/**
 * Main application file for running an Express server with MongoDB, user, and member routers.
 *
 * @requires dotenv
 * @requires ./db/mongodb
 * @requires express
 * @requires cors
 * @requires cookie-parser
 * @requires ./routers/user
 * @requires ./routers/member
 * @requires ./bot
 *
 * @type {Object} express.Application
 */
require('dotenv').config();
require('./db/mongodb');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routers/user');
const memberRouter = require('./routers/member');
const client = require('./bot');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routers setup
app.use(userRouter);
app.use(memberRouter);

// Start the bot and the server
Promise.all([client.login(process.env.BOT_TOKEN), app.listen(PORT)])
    .then(() => {
        console.log('Server is running on port: ' + PORT);
    })
    .catch((err) => console.log(err));
