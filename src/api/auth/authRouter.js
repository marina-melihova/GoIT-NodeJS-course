const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { authorize } = require('../../helpers/authorize');
const { validate } = require('../../helpers/validate');
const { signUp, signIn, logout, signSchema } = require('./authController');

const router = Router();

router.post('/register', validate(signSchema), asyncHandler(signUp));
router.post('/login', validate(signSchema), asyncHandler(signIn));
router.get('/logout', authorize, asyncHandler(logout));

module.exports = router;
