require('dotenv').config();
const mongoose = require('mongoose');

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