const Joi = require('joi');
const {
  listContacts,
  findContactById,
  removeContact,
  addContact,
  changeContact,
} = require('./contacts.model');

const validateRequest = async (body, schema) => {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  const value = await schema.validateAsync(body, options);
  return value;
};

const validateCreateContact = async (req, res, next) => {
  const schemaCreateContact = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  });

  const value = await validateRequest(req.body, schemaCreateContact);
  req.body = value;
  next();
};

const createContact = async (req, res) => {
  const newContact = await addContact(req.body);
  res.status(201);
  res.json(newContact);
};

const getContacts = async (req, res) => {
  const contacts = await listContacts();
  res.json(contacts);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await findContactById(contactId);

  if (!contact) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.json(contact);
};

const validateUpdateContact = async (req, res, next) => {
  const schemaUpdateContact = Joi.object({
    name: Joi.string().empty(''),
    email: Joi.string().email().empty(''),
    phone: Joi.string().empty(''),
  });

  const value = await validateRequest(req.body, schemaUpdateContact);
  req.body = value;
  next();
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;

  const contact = await findContactById(contactId);
  if (!contact) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'missing fields' });
  }

  const updatedContact = await changeContact(contactId, req.body);

  res.json(updatedContact);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  const contact = await findContactById(contactId);

  if (!contact) {
    return res.status(404).json({ message: 'Not found' });
  }

  await removeContact(contactId);

  res.json({ message: 'contact deleted' });
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  validateCreateContact,
  validateUpdateContact,
};
