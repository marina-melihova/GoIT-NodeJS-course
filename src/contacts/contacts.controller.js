const {
  listContacts,
  findContactById,
  removeContact,
  saveContact,
  changeContact,
} = require('./contacts.model');

const addContact = async (req, res) => {
  const newContact = await saveContact(req.body);
  res.status(201).send(newContact);
};

const getContacts = async (req, res) => {
  console.log('test');
  const contacts = await listContacts();
  res.status(200).send(contacts);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await findContactById(contactId);

  if (!contact) {
    return res.status(404).send({ message: 'Not found' });
  }

  return res.status(200).send(contact);
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;

  const contact = await findContactById(contactId);
  if (!contact) {
    return res.status(404).send({ message: 'Not found' });
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: 'missing fields' });
  }

  const updatedContact = await changeContact(contactId, req.body);

  return res.status(200).send(updatedContact);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  const contact = await findContactById(contactId);

  if (!contact) {
    return res.status(404).send({ message: 'Not found' });
  }

  await removeContact(contactId);

  return res.status(200).send({ message: 'contact deleted' });
};

module.exports = {
  addContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};
