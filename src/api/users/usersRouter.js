const { Router } = require('express');
const { authorize } = require('../../helpers/authorize');
const { getCurrentUser } = require('./usersController');

const router = Router();

router.get('/current', authorize, getCurrentUser);

module.exports = router;
