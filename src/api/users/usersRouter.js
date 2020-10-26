const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { authorize } = require('../../helpers/authorize');
const { validate } = require('../../helpers/validate');
const usersController = require('./usersController');

const router = Router();

router.patch(
  '/',
  asyncHandler(authorize),
  validate(usersController.subscrSchema),
  asyncHandler(usersController.updateSubscription),
);

router.get('/current', asyncHandler(authorize), usersController.getCurrentUser);

module.exports = router;
