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

// CRUD

// 1. C - create
// POST /users
const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});
router.post('/', validate(createContactSchema), addContact);

// 2. R - read
// GET /users
router.get('/', getContacts);
// GET /users/:id
router.get('/:contactId', getContactById);

// 3. U - update
// PUT /users/:id
const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
});
router.patch('/:contactId', validate(updateContactSchema), updateContact);

// 4. D - delete
// DELETE /users/:id
router.delete('/:contactId', deleteContact);

exports.contactsRouter = router;
