require('dotenv').config();
const mongoose = require('mongoose');

/**
 * Connects to a MongoDB database using Mongoose.
 *
 * @requires dotenv
 * @requires mongoose
 *
 * @throws {Error} Throws an error if there is an issue connecting to the MongoDB database.
 *
 * @returns {Promise} A promise that resolves when the connection to MongoDB is successful.
 *
 * @example
 * // Import the required modules and configure environment variables using dotenv
 * require('dotenv').config();
 * const mongoose = require('mongoose');
 *
 * // Establish a connection to the MongoDB database
 * mongoose
 *   .connect(process.env.MONGODB_URL, {
 *      useNewUrlParser: true,
 *      useUnifiedTopology: true
 *   })
 *   .then(() => {
 *      console.log('Connected to MongoDB successfully.');
 *   })
 *   .catch((err) => {
 *      console.error("Unable to connect to MongoDB. Error: " + err);
 *   });
 */


mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('()=> Connected to mongodb *');
    })
    .catch((err) => {
        console.log("Unable to connect to MongoDB. Error: " + err);
    });