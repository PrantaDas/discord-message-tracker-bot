const cachingdb = require('../db/cachingdb');
const Member = require('../schemas/member.schema');

//allowed fields for creation
const CREATE_ALLOWED = new Set(['name', 'username', 'userId', 'owner']);


/**
 * Creates a new member and saves it to the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @throws {Object} Returns an HTTP response with an error message if the creation fails.
 *
 * @returns {Object} Returns an HTTP response with the created member if successful.
 *
 * @example
 * // Create a new member
 * const req = { body: { name: 'John Doe', username: 'johndoe', userId: '123456', owner: 'user123' }, user: { userId: 'user123' } };
 * const res = { status: (code) => {}, send: (data) => {} };
 * create(req, res);
 */
const create = async (req, res) => {
    try {
        if (!req.body.userId) return res.status(400).send({ message: 'User ID and Owner is required' });
        const isValid = Object.keys(req.body).every((key) => CREATE_ALLOWED.has(key));
        if (!isValid) return res.status(400).send({ message: 'Bad request' });
        req.body.owner = req.user.userId;
        const member = new Member(req.body);
        await member.save();
        res.status(200).send(member);
        try {
            const members = await Member.find({ owner: req.user.userId });
            // console.log(members);
            // members.push(member);
            if (members.length > 0) cachingdb.set('members', members)
        }
        catch (err) { console.log(err) }
    }
    catch (err) {
        console.log(err);
        res.status(err.status || 500).send(err.reason || 'Internal Server Error');
    }
};


/**
 * Retrieves all members from the database, with an optional caching mechanism.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @throws {Object} Returns an HTTP response with an error message if retrieval fails.
 *
 * @returns {Object} Returns an HTTP response with the list of members if successful.
 *
 * @example
 * // Get all members
 * const req = { user: { userId: 'user123' } };
 * const res = { status: (code) => {}, send: (data) => {} };
 * getAll(req, res);
 */
const getAll = async (req, res) => {
    try {
        const cachedMembers = await cachingdb.get('members');
        if (cachedMembers?.length > 0) return res.status(200).send(cachedMembers);
        const members = await Member.find({ owner: req.user.userId });
        if (!members) return res.status(404).send({ message: 'Member not found' });
        res.status(200).send(members);
    }
    catch (err) {
        console.log(err);
        res.status(err.status || 500).send(err.reason || 'Internal Server Error');
    }
};


/**
 * Deletes a member from the database, with an optional cache update.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @throws {Object} Returns an HTTP response with an error message if deletion fails.
 *
 * @returns {Object} Returns an HTTP response indicating successful deletion.
 *
 * @example
 * // Delete a member
 * const req = { params: { id: 'member123' }, user: { userId: 'user123', owner: { userId: 'owner123' } } };
 * const res = { status: (code) => {}, send: (data) => {} };
 * deleteMember(req, res);
 */
const deleteMember = async (req, res) => {
    try {
        const member = await Member.findOne({ _id: req.params.id, owner: req.user.owner.userId });
        if (!member) return res.status(400).send({ message: 'Bad request' });
        await member.deleteOne();
        res.status(200).send({ message: 'Member deleted' });
        try {
            let cachedMembers = await cachingdb.get('members');
            if (cachedMembers.length > 0) {
                cachedMembers = cachedMembers.filter((m) => m._id !== req.params.id);
                cachingdb.set('members', cachedMembers);
            }
            else {
                const members = await Member.find({ _id: req.user._id });
                if (members.length > 0) cachingdb.set('members', members);
                else return;
            }
        }
        catch (err) { console.log(err) }
    }
    catch (err) {
        console.log(err);
        res.status(err.status || 500).send(err.reason || 'Internal Server Error');
    }
};

module.exports = { create, getAll, deleteMember };