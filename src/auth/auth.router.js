const { Router } = require('express');
const { validate } = require('../helpers/validate');
const { signUp, signIn, signSchema } = require('./auth.controller');

const router = Router();

router.post('/auth/register', validate(signSchema), signUp);
router.post('/sign-in', validate(signSchema), signIn);

exports.authRouter = router;
