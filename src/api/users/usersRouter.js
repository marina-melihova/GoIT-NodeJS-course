const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { validate, authorize, uploadFile } = require('../../services');
const usersController = require('./usersController');

const router = Router();

router.get('/current', asyncHandler(authorize), usersController.getCurrentUser);

router.patch(
  '/avatar',
  asyncHandler(authorize),
  uploadFile.upload.single('avatar'),
  asyncHandler(usersController.updateAvatar),
);

router.patch(
  '/sub',
  asyncHandler(authorize),
  validate(usersController.subscrSchema),
  asyncHandler(usersController.updateSubscription),
);

module.exports = router;
