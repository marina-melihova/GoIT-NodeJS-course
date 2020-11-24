const Joi = require('joi');
const { AppError } = require('../../services');
Joi.objectId = require('joi-objectid')(Joi);
const ContactModel = require('./contactsModel');

const createContact = async (req, res) => {
  const newContact = await ContactModel.addContact(req.body);
  return res.status(201).json(newContact);
};

const getContacts = async (req, res) => {
  const { page, limit, sub } = req.query;
  let contacts;
  if (limit) {
    contacts = await ContactModel.getContacts(sub, true, page, limit);
  } else {
    contacts = await ContactModel.getContacts(sub);
  }
  return res.json(contacts);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await ContactModel.getContactById(contactId);
  if (!contact) {
    return next(new AppError(`No contact found with that ID`, 404));
  }
  return res.json(contact);
};

const updateContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'missing fields' });
  }
  const { contactId } = req.params;
  const contact = await ContactModel.updateContact(contactId, req.body);
  if (!contact) {
    return next(new AppError(`No contact found with that ID`, 404));
  }
  return res.json(contact);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deleteResult = await ContactModel.deleteContact({ _id: contactId });
  if (!deleteResult.deletedCount) {
    return next(new AppError(`No contact found with that ID`, 404));
  }
  return res.json({ message: 'contact deleted' });
};

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
  subscription: Joi.string().empty('').valid('free', 'pro', 'premium'),
});

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  schemaId,
  schemaCreateContact,
  schemaUpdateContact,
};
