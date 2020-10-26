const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { authorize } = require('../../helpers/authorize');
const { validate } = require('../../helpers/validate');
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

module.exports = router;
