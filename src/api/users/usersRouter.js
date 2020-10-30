const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { authorize } = require('../../helpers/authorize');
const { validate } = require('../../helpers/validate');
const { upload } = require('../../helpers/uploadAvatar');
const usersController = require('./usersController');

const router = Router();

router.get('/current', asyncHandler(authorize), usersController.getCurrentUser);

router.patch(
  '/avatar',
  asyncHandler(authorize),
  upload.single('avatar'),
  asyncHandler(usersController.updateAvatar),
);

router.patch(
  '/sub',
  asyncHandler(authorize),
  validate(usersController.subscrSchema),
  asyncHandler(usersController.updateSubscription),
);

module.exports = router;
