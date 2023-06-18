const User = require('../schemas/user.schema');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const CREATE_ALLOWED = new Set(['firstName', 'lastName', 'username', 'email', 'link', 'password', 'status', 'userId']);
const UPDATE_ALLOWED = new Set(['firstName', 'lastName', 'username', 'email', 'link', 'password', 'oldPassword', 'newPassword', 'userId']);

const register = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) return res.status(400).send({ message: 'Bad Request' });
        const isValid = Object.keys(req.body).every((key) => CREATE_ALLOWED.has(key));
        if (!isValid) return res.status(400).send({ message: 'Bad Request' });
        const user = new User(req.body);
        await user.save();
        res.status(200).send(user);
    }
    catch (err) {
        console.log(err);
        res.status(err.status || 500).send(err.reason || 'Internal Server Error');
    }
};

const login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) return res.status(400).send({ message: 'Email and Password is Required' });
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user) return res.status(400).send({ message: 'Unable to login' });
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        res.cookie('token', token, { httpOnly: true, sameSite: 'None', secure: true, expires: new Date(Date.now() + 259200000) });
        res.status(200).send(user);
    }
    catch (err) {
        console.log(err);
        res.status(err.status || 500).send(err.reason || 'Internal Server Error');
    }
};

const me = (req, res) => {
    try {
        res.status(200).send(req.user);
    }
    catch (err) {
        console.log(err);
        res.status(err.status || 500).send(err.reason || 'Internal Server Error');
    }
};

const updateOwn = async (req, res) => {
    try {
        if (req.user.status === 'deactive') return res.status(401).send({ message: 'Unathorized' });
        const isValid = Object.keys(req.body).every((key) => UPDATE_ALLOWED.has(key));
        if (!isValid) return res.status(400).send({ message: 'Bad Request' });
        let user;
        if (req?.body?.oldPassword) {
            user = await User.findByCredentials(req.user.email, req.body.oldPassword);
            user.password = req.body.newPassword;
        }
        else user = await User.findOne({ email: req.user.email });
        if (!user) return res.status(404).send({ message: 'User not found' });
        Object.keys(req.body).forEach((key) => user[key] = req.body[key]);
        await user.save();
        res.status(200).send(user);
    }
    catch (err) {
        console.log(err);
        res.status(err.status || 500).send(err.reason || 'Internal Server Error');
    }
};


const updateOne = async (req, res) => {
    try {
        if (req.user.status === 'deactive') return res.status(401).send({ message: 'Unathorized' });
        const isValid = Object.keys(req.body).every((key) => UPDATE_ALLOWED.has(key));
        if (!isValid) return res.status(400).send({ message: 'Bad Request' });
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(404).send({ message: 'User not found' });
        Object.keys(req.body).forEach((key) => user[key] = req.body[key]);
        await user.save();
    }
    catch (err) {
        console.log(err);
        res.status(err.status || 500).send(err.reason || 'Internal Server Error');
    }
};

const getOne = async (req, res) => {
    try {
        if (req.user.status === 'deactive') return res.status(401).send({ message: 'Unathorized' });
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(404).send({ message: 'User not found' });
        res.status(200).send(user);
    }
    catch (err) {
        console.log(err);
        res.status(err.status || 500).send(err.reason || 'Internal Server Error');
    }
};

const getAll = async (req, res) => {
    try {
        if (req.user.status === 'deactive') return res.status(401).send({ message: 'Unathorized' });
        const users = await User.find({ ...req.query || {} });
        if (!users) return res.status(404).send({ message: 'Users not found' });
        res.status(200).send(users);
    }
    catch (err) {
        console.log(err);
        res.status(err.status || 500).send(err.reason || 'Internal Server Error');
    }
};

const remove = async (req, res) => {
    try {
        if (req.user.status === 'deactive') return res.status(401).send({ message: 'Unathorized' });
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(404).send({ message: 'User not found' });
        await user.deleteOne();
        res.status(200).send({ message: 'User deleted' })
    }
    catch (err) {
        console.log(err);
        res.status(err.status || 500).send(err.reason || 'Internal Server Error');
    }
};

module.exports = { register, login, me, updateOwn, getOne, updateOne, getAll, remove };