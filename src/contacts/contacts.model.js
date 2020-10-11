const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const { promises: fsPromise } = fs;

const contactsPath = path.join(__dirname, '../db/contacts.json');

const listContacts = async () => {
  try {
    const contacts = await fsPromise.readFile(contactsPath, 'utf-8');
    return JSON.parse(contacts);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const findContactById = async id => {
  try {
    const contacts = await listContacts();

    const contactId = Number.isNaN(Number(id)) ? id : parseInt(id);
    return contacts.find(({ id }) => id === contactId);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const removeContact = async id => {
  try {
    const contacts = await listContacts();

    const contactId = Number.isNaN(Number(id)) ? id : parseInt(id);
    const newList = contacts.filter(({ id }) => id !== contactId);

    await fsPromise.writeFile(contactsPath, JSON.stringify(newList));
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const addContact = async contact => {
  try {
    const { name, email, phone } = contact;

    const contacts = await listContacts();

    const id = shortid.generate();
    const createdContact = { id, name, email, phone };
    const newList = [...contacts, createdContact];

    await fsPromise.writeFile(contactsPath, JSON.stringify(newList));

    return createdContact;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const changeContact = async (id, contactParams) => {
  try {
    const contacts = await listContacts();

    const contactId = Number.isNaN(Number(id)) ? id : parseInt(id);
    const contactIndex = contacts.findIndex(({ id }) => id === contactId);

    if (contactIndex === -1) {
      return;
    }

    contacts[contactIndex] = {
      ...contacts[contactIndex],
      ...contactParams,
    };

    await fsPromise.writeFile(contactsPath, JSON.stringify(contacts));

    return contacts[contactIndex];
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

module.exports = {
  listContacts,
  findContactById,
  removeContact,
  addContact,
  changeContact,
};
