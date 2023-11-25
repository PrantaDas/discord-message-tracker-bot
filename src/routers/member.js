/**
 * Express Router for managing member-related routes with authentication middleware.
 *
 * @requires express
 * @requires ../middleware/middleware
 * @requires ../entities/member.entity
 *
 * @type {Object} express.Router
 *
 * @example
 * // Use this router in your main application file
 * const express = require('express');
 * const auth = require('../middleware/middleware');
 * const { create, getAll, deleteMember } = require('../entities/member.entity');
 * const router = new express.Router();
 *
 * // Define routes with authentication middleware
 * router.post('/member/create', auth, create);
 * router.get('/members', auth, getAll);
 * router.delete('/member/:id', auth, deleteMember);
 *
 * module.exports = router;
 */

const express = require('express');
const auth = require('../middleware/middleware');
const { create, getAll, deleteMember } = require('../entities/member.entity');
const router = new express.Router();

router.post('/member/create', auth, create);

router.get('/members', auth, getAll);

router.delete('/member/:id', auth, deleteMember);

module.exports = router;