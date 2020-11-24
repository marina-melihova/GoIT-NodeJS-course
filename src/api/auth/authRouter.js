const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { authorize, validate } = require('../../services');
const authController = require('./authController');

const router = Router();

router.post(
  '/register',
  validate(authController.signSchema),
  asyncHandler(authController.signUp),
);

router.post(
  '/login',
  validate(authController.signSchema),
  asyncHandler(authController.signIn),
);

router.post(
  '/logout',
  asyncHandler(authorize),
  asyncHandler(authController.logout),
);

router.get(
  '/verify/:verificationToken',
  asyncHandler(authController.verifyEmail),
);

module.exports = router;
