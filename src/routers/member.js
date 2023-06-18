const express = require('express');
const auth = require('../middleware/middleware');
const { create, getAll, deleteMember } = require('../entities/member.entity');
const router = new express.Router();

router.post('/member/create', auth, create);

router.get('/members', auth, getAll);

router.delete('/member/:id', auth, deleteMember);

module.exports = router;