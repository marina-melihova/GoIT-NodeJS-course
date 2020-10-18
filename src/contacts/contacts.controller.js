const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ContactModel } = require('./contacts.model');

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
