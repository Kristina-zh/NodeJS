const { promises: fsPromises } = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  const data = await fsPromises.readFile(contactsPath, "utf-8");
  // console.log("data :", data);
}

async function getContactById(id) {
  data = await fsPromises.readFile(contactsPath, "utf-8");
  dataById = await JSON.parse(data).find(v => v.id === id);
  console.log("dataById :", dataById);
}

// getContactById(9);

async function removeContact(id) {
  data = await fsPromises.readFile(contactsPath, "utf-8");
  newJson = await JSON.parse(data).filter(v => v.id !== id);

  writeNewJson = await fsPromises.writeFile(
    contactsPath,
    JSON.stringify(newJson)
  );
  console.log("contact deleted successfully");
}

// removeContact(1);

async function addContact(name, email, phone) {
  data = await fsPromises.readFile(contactsPath, "utf-8");
  dataId = await JSON.parse(data).map(v => v.id);
  dataMaxId = await Math.max.apply(1, dataId);

  writeNewJson = await fsPromises.writeFile(
    contactsPath,
    JSON.stringify([
      ...JSON.parse(data),
      {
        id: dataMaxId + 1,
        name: name,
        email: email,
        phone: phone
      }
    ])
  );

  console.log("contact added successfully");
}

// addContact("Allen Raymond", "nulla.ante@vestibul.co.uk", "(992) 914-3792");

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact
};
