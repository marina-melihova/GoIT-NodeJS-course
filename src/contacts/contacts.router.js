const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const Joi = require('joi');
const { validate } = require('../helpers/validate');
const {
  addContact,
  getContacts,
  getContactById,
  deleteContact,
  updateContact,
} = require('./contacts.controller');

const router = Router();

const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});
router.post('/', validate(createContactSchema), asyncHandler(addContact));

router.get('/', asyncHandler(getContacts));

router.get('/:contactId', asyncHandler(getContactById));

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
});
router.patch(
  '/:contactId',
  validate(updateContactSchema),
  asyncHandler(updateContact),
);

router.delete('/:contactId', asyncHandler(deleteContact));

exports.contactsRouter = router;
