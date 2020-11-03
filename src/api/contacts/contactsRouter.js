const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { validate } = require('../../services');
const contactsController = require('./contactsController');

const router = Router();

router.post(
  '/',
  validate(contactsController.schemaCreateContact),
  asyncHandler(contactsController.createContact),
);

router.get('/', asyncHandler(contactsController.getContacts));

router.get(
  '/:contactId',
  validate(contactsController.schemaId, 'params'),
  asyncHandler(contactsController.getContactById),
);

router.patch(
  '/:contactId',
  validate(contactsController.schemaId, 'params'),
  validate(contactsController.schemaUpdateContact),
  asyncHandler(contactsController.updateContact),
);

router.delete(
  '/:contactId',
  validate(contactsController.schemaId, 'params'),
  asyncHandler(contactsController.deleteContact),
);

module.exports = router;
