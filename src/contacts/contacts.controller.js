const {
  listContacts,
  findContactById,
  removeContact,
  saveContact,
  changeContact,
} = require('./contacts.model');

const addContact = async (req, res) => {
  try {
    const newContact = await saveContact(req.body);
    res.status(201).send(newContact);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).send(contacts);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const id = Number.isNaN(parseInt(contactId))
    ? contactId
    : parseInt(contactId);
  try {
    const contact = await findContactById(id);

    if (!contact) {
      return res.status(404).send({ message: 'Not found' });
    }

    return res.status(200).send(contact);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const id = Number.isNaN(parseInt(contactId))
    ? contactId
    : parseInt(contactId);
  try {
    const contact = await findContactById(id);
    if (!contact) {
      return res.status(404).send({ message: 'Not found' });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ message: 'missing fields' });
    }

    const updatedContact = await changeContact(id, req.body);

    return res.status(200).send(updatedContact);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const id = Number.isNaN(parseInt(contactId))
    ? contactId
    : parseInt(contactId);
  try {
    const contact = await findContactById(id);

    if (!contact) {
      return res.status(404).send({ message: 'Not found' });
    }

    await removeContact(id);

    return res.status(200).send({ message: 'contact deleted' });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  addContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};
