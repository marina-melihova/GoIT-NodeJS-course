const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ContactModel } = require('./contacts.model');

const schemaId = Joi.object({
  contactId: Joi.objectId(),
});

const schemaCreateContact = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().empty(''),
  email: Joi.string().email().empty(''),
  phone: Joi.string().empty(''),
});

const optionsValBody = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

const validateId = async (req, res, next) => {
  const value = await schemaId.validateAsync(req.params);
  req.params = value;
  next();
};

const validateCreateContact = async (req, res, next) => {
  const value = await schemaCreateContact.validateAsync(
    req.body,
    optionsValBody,
  );
  req.body = value;
  next();
};

const validateUpdateContact = async (req, res, next) => {
  const value = await schemaUpdateContact.validateAsync(
    req.body,
    optionsValBody,
  );
  req.body = value;
  next();
};

const createContact = async (req, res) => {
  const newContact = await ContactModel.create(req.body);
  res.status(201);
  res.json(newContact);
};

const getContacts = async (req, res) => {
  const contacts = await ContactModel.find();
  res.json(contacts);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await ContactModel.findById(contactId);
  if (!contact) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(contact);
};

const updateContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'missing fields' });
  }
  const { contactId } = req.params;
  const contact = await ContactModel.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!contact) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(contact);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deleteResult = await ContactModel.deleteOne({ _id: contactId });
  if (!deleteResult.deletedCount) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json({ message: 'contact deleted' });
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  validateId,
  validateCreateContact,
  validateUpdateContact,
};
