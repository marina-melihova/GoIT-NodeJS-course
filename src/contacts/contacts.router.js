const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const {
  createContact,
  getContacts,
  getContactById,
  deleteContact,
  updateContact,
  validateId,
  validateCreateContact,
  validateUpdateContact,
} = require('./contacts.controller');

const router = Router();

router.post(
  '/',
  asyncHandler(validateCreateContact),
  asyncHandler(createContact),
);

router.get('/', async (req, res, next) => {
  getContacts(req, res).catch(next);
});

router.get(
  '/:contactId',
  asyncHandler(validateId),
  asyncHandler(getContactById),
);

router.patch(
  '/:contactId',
  asyncHandler(validateId),
  asyncHandler(validateUpdateContact),
  asyncHandler(updateContact),
);

router.delete(
  '/:contactId',
  asyncHandler(validateId),
  asyncHandler(deleteContact),
);

exports.contactsRouter = router;
