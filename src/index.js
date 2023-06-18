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

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(userRouter);
app.use(memberRouter);


Promise.all([client.login(process.env.BOT_TOKEN), app.listen(PORT)])
    .then(() => {
        console.log('()=> Server is running on port :' + PORT + '*');
    })
    .catch((err) => console.log(err));

// app.listen(PORT, () => {
//     console.log('()=> Server is running on port :' + PORT + '*');
// });