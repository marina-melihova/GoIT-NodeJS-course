const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { validate } = require('../helpers/validate');
const contactsController = require('./contacts.controller');

const router = Router();

router.post(
  '/',
  validate(contactsController.schemaCreateContact),
  asyncHandler(contactsController.createContact),
);

router.get('/', async (req, res, next) => {
  contactsController.getContacts(req, res).catch(next);
});

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

exports.contactsRouter = router;
