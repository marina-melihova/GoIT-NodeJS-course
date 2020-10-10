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
    const statusCode = error.status || 500;
    res.status(statusCode).send(error.message);
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).send(contacts);
  } catch (error) {
    const statusCode = error.status || 500;
    res.status(statusCode).send(error.message);
  }
};

const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await findContactById(contactId);

    if (!contact) {
      return res.status(404).send({ message: 'Not found' });
    }

    return res.status(200).send(contact);
  } catch (error) {
    const statusCode = error.status || 500;
    res.status(statusCode).send(error.message);
  }
};

const updateContact = async (req, res) => {
  try {
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
  } catch (error) {
    const statusCode = error.status || 500;
    res.status(statusCode).send(error.message);
  }
};

const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await findContactById(contactId);

    if (!contact) {
      return res.status(404).send({ message: 'Not found' });
    }

    await removeContact(contactId);

    return res.status(200).send({ message: 'contact deleted' });
  } catch (error) {
    const statusCode = error.status || 500;
    res.status(statusCode).send(error.message);
  }
};

module.exports = {
  addContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};
