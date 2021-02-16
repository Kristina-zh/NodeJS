const contacts = require("./contacts");
const { removeContact } = require("./contacts");
const argv = require("yargs").argv;

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      return contacts.listContacts();
      break;

    case "get":
      return contacts.getContactById(id);
      break;

    case "add":
      return contacts.addContact(name, email, phone);
      break;

    case "remove":
      return removeContact(id);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
