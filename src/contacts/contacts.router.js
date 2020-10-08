const { Router } = require('express');
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
router.post('/', validate(createContactSchema), addContact);

router.get('/', getContacts);

router.get('/:contactId', getContactById);

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
});
router.patch('/:contactId', validate(updateContactSchema), updateContact);

router.delete('/:contactId', deleteContact);

exports.contactsRouter = router;
