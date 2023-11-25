const User = require('../schemas/user.schema');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const CREATE_ALLOWED = new Set(['firstName', 'lastName', 'username', 'email', 'link', 'password', 'status', 'userId']);
const UPDATE_ALLOWED = new Set(['firstName', 'lastName', 'username', 'email', 'link', 'password', 'oldPassword', 'newPassword', 'userId']);


/**
 * Registers a new user by saving their information to the database.
 *
 * @param {Object} req - The HTTP request object containing user registration details.
 * @param {Object} res - The HTTP response object.
 *
 * @throws {Object} Returns an HTTP response with an error message if registration fails.
 *
 * @returns {Object} Returns an HTTP response with the registered user details if successful.
 *
 * @example
 * // Register a new user
 * const req = { body: { email: 'user@example.com', password: 'password123' } };
 * const res = { status: (code) => {}, send: (data) => {} };
 * register(req, res);
 */
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


/**
 * Authenticates a user by checking their email and password and provides a login token.
 *
 * @param {Object} req - The HTTP request object containing user login details.
 * @param {Object} res - The HTTP response object.
 *
 * @throws {Object} Returns an HTTP response with an error message if authentication fails.
 *
 * @returns {Object} Returns an HTTP response with the user details and a login token if successful.
 *
 * @example
 * // Authenticate and log in a user
 * const req = { body: { email: 'user@example.com', password: 'password123' } };
 * const res = { status: (code) => {}, send: (data) => {}, cookie: (name, value, options) => {} };
 * login(req, res);
 */
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

/**
 * Retrieves the user profile information for the authenticated user.
 *
 * @param {Object} req - The HTTP request object containing user authentication details.
 * @param {Object} res - The HTTP response object.
 *
 * @throws {Object} Returns an HTTP response with an error message if retrieval fails.
 *
 * @returns {Object} Returns an HTTP response with the authenticated user's profile information if successful.
 */

const me = (req, res) => {
    try {
        res.status(200).send(req.user);
    }
    catch (err) {
        console.log(err);
        res.status(err.status || 500).send(err.reason || 'Internal Server Error');
    }
};


/**
 * Updates the profile information of the authenticated user, including the option to change the password.
 *
 * @param {Object} req - The HTTP request object containing user details and the desired updates.
 * @param {Object} res - The HTTP response object.
 *
 * @throws {Object} Returns an HTTP response with an error message if the update fails.
 *
 * @returns {Object} Returns an HTTP response with the updated user profile information if successful.
 */
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

/**
 * Updates the profile information of a user by their ID, with authorization checks.
 *
 * @param {Object} req - The HTTP request object containing user details and the desired updates.
 * @param {Object} res - The HTTP response object.
 *
 * @throws {Object} Returns an HTTP response with an error message if the update fails or if unauthorized.
 */
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


/**
 * Retrieves the profile information of a user by their ID, with authorization checks.
 *
 * @param {Object} req - The HTTP request object containing user details and the target user's ID.
 * @param {Object} res - The HTTP response object.
 *
 * @throws {Object} Returns an HTTP response with an error message if the retrieval fails or if unauthorized.
 */
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


/**
 * Retrieves a list of users based on optional query parameters, with authorization checks.
 *
 * @param {Object} req - The HTTP request object containing user details and optional query parameters.
 * @param {Object} res - The HTTP response object.
 *
 * @throws {Object} Returns an HTTP response with an error message if the retrieval fails or if unauthorized.
 */
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


/**
 * Deletes a user by their ID, with authorization checks.
 *
 * @param {Object} req - The HTTP request object containing user details and the target user's ID.
 * @param {Object} res - The HTTP response object.
 *
 * @throws {Object} Returns an HTTP response with an error message if the deletion fails or if unauthorized.
 */
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