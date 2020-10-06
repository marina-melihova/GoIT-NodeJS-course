const fs = require("fs");
const path = require("path");
const shortid = require("shortid");
const { promises: fsPromise } = fs;

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function getContacts() {
  try {
    // throw new Error("Error: could not read file");
    const contacts = await fsPromise.readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

async function listContacts() {
  const contacts = await getContacts();
  contacts && console.table(contacts);
}

async function getContactById(contactId) {
  const contacts = await getContacts();
  contacts && console.table(contacts.find(({ id }) => id === contactId));
}

async function removeContact(contactId) {
  const contacts = await getContacts();
  if (!contacts) {
    return;
  }
  const newList = contacts.filter(({ id }) => id !== contactId);
  try {
    // throw new Error("Error: could not write file");
    await fsPromise.writeFile(contactsPath, JSON.stringify(newList));
    console.log(`Contact with ID = ${contactId} has been successfully removed`);
  } catch (error) {
    console.error(error.message);
  }
}

async function addContact(name, email, phone) {
  const contacts = await getContacts();
  if (!contacts) {
    return;
  }
  const id = shortid.generate();
  const newContact = { id, name, email, phone };
  const newList = [...contacts, newContact];
  try {
    // throw new Error("Error: could not write file");
    await fsPromise.writeFile(contactsPath, JSON.stringify(newList));
    console.log(`A new contact has been successfully added:`);
    console.table(newContact);
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
