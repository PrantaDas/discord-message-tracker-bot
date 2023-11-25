require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../schemas/user.schema');


/**
 * Middleware function for user authentication using JSON Web Tokens (JWT).
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The callback function to call after successful authentication.
 *
 * @throws {Object} Returns an HTTP response with an error message if authentication fails.
 */
const auth = async (req, res, next) => {
    try {
        const token = req?.cookies?.token;
        if (!token) return res.status(401).send({ message: 'Unauthorized' });
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ _id: decoded.id, status: 'active' });
        if (!user) return res.status(401).send({ message: 'Unauthorized' });
        req.user = user;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(err.status || 500).send(err.reason || 'Internal Server Error');
    }
};

module.exports = auth;