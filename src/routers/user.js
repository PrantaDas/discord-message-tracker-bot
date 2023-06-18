const express = require('express');
const auth = require('../middleware/middleware');
const router = new express.Router();
const { register, login, me, updateOwn, getOne, updateOne, getAll, remove } = require('../entities/user.entity');

router.post('/user/register', register);

router.post('/user/login', login);

router.get('/user/me', auth, me);

router.patch('/user/me', auth, updateOwn);

router.get('/user/profile/:id', auth, getOne);

router.patch('/user/:id', auth, updateOne);

router.get('/users', auth, getAll);

router.delete('/user/:id', auth, remove);

module.exports = router;