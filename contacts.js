const fs = require("fs");
const path = require("path");
const shortid = require("shortid");
const { promises: fsPromise } = fs;

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  try {
    const contacts = await fsPromise.readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    return contacts.find(({ id }) => id === contactId);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const newList = contacts.filter(({ id }) => id !== contactId);
    await fsPromise.writeFile(contactsPath, JSON.stringify(newList));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const id = shortid.generate();
    const newContact = { id, name, email, phone };
    const newList = [...contacts, newContact];
    await fsPromise.writeFile(contactsPath, JSON.stringify(newList));
    return newContact;
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
