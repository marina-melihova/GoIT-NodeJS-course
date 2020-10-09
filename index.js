const contacts = require("./contacts");

const argv = require("yargs").argv;

async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      const list = await contacts.listContacts();
      console.table(list);
      break;

    case "get":
      const contact = await contacts.getContactById(id);
      console.table(contact);
      break;

    case "add":
      const newContact = await contacts.addContact(name, email, phone);
      console.log(`A new contact has been successfully added:`);
      console.table(newContact);
      break;

    case "remove":
      await contacts.removeContact(id);
      console.log(`Contact has been successfully removed`);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
