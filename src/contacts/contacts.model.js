const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const { promises: fsPromise } = fs;

const contactsPath = path.join(__dirname, '../db/contacts.json');

const listContacts = async () => {
  try {
    // throw new Error('testing check');
    const contacts = await fsPromise.readFile(contactsPath, 'utf-8');
    return JSON.parse(contacts);
  } catch (error) {
    throw 'could not read file: ' + error;
  }
};

const findContactById = async contactId => {
  const contacts = await listContacts();
  return contacts.find(({ id }) => id === contactId);
};

const removeContact = async contactId => {
  const contacts = await listContacts();
  const newList = contacts.filter(({ id }) => id !== contactId);
  try {
    // throw new Error("testing check");
    await fsPromise.writeFile(contactsPath, JSON.stringify(newList));
  } catch (error) {
    throw 'could not write file: ' + error;
  }
};

const saveContact = async contact => {
  const { name, email, phone } = contact;
  const contacts = await listContacts();
  const id = shortid.generate();
  const createdContact = { id, name, email, phone };
  const newList = [...contacts, createdContact];
  try {
    // throw new Error("testing check");
    await fsPromise.writeFile(contactsPath, JSON.stringify(newList));
    return createdContact;
  } catch (error) {
    throw 'could not write file: ' + error;
  }
};

const changeContact = async (id, contactParams) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(contact => contact.id === id);

  if (contactIndex === -1) {
    return;
  }

  contacts[contactIndex] = {
    ...contacts[contactIndex],
    ...contactParams,
  };
  try {
    // throw new Error('testing check');
    await fsPromise.writeFile(contactsPath, JSON.stringify(contacts));
    return contacts[contactIndex];
  } catch (error) {
    throw 'could not write file: ' + error;
  }
};

module.exports = {
  listContacts,
  findContactById,
  removeContact,
  saveContact,
  changeContact,
};
