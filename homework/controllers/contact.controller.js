const contacts = require("../models/contacts.json");
const Joi = require("joi");
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync(path.join(__dirname, "../models/contacts.json"));
const db = low(adapter);

class ContactController {
  findContactIndex(contactId) {
    const findId = +contactId;
    return contacts.findIndex(({ id }) => id === findId);
  }

  validateContactId = (req, res, next) => {
    const {
      params: { contactId }
    } = req;

    const id = this.findContactIndex(contactId);

    if (id === -1) {
      return res.status(404).send("Not found");
    }
    next();
  };

  listContacts = (req, res, next) => {
    console.log(
      "DB12399 :",
      db.get("contacts").push({ id: 1, title: "lowdb is awesome" })
    );
    res.json(contacts);
  };

  getById = (req, res, next) => {
    const {
      params: { contactId }
    } = req;

    const id = this.findContactIndex(contactId);

    const getById = contacts[id];

    res.json(getById);

    next();
  };

  addContact(req, res) {
    const { body } = req;

    const addContact = {
      id: contacts.length + 1,
      ...body
    };

    contacts.push(addContact);

    db.get("contacts")
      .push(addContact)
      .write();

    res.status(201).json(addContact);
  }

  validateAddContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required()
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send("missing required name field");
    }
    next();
  }

  removeContact = (res, req, next) => {
    const {
      params: { contactId }
    } = req;

    const id = this.findContactIndex(contactId);

    console.log("id :", id);

    const removeContact = contacts.splice(id, 1);
    console.log("removeContact :", removeContact);

    res.status(200).json("contact deleted");
    next();
  };

  validateUpdateContact = (req, res, next) => {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      password: Joi.string()
    });

    const validationResult = validationRules.validate(req.body);

    console.log(
      "validationResult :",
      JSON.stringify(validationResult.value) == "{}"
    );

    if (
      validationResult.error ||
      JSON.stringify(validationResult.value) == "{}"
    ) {
      return res.status(400).send("missing fields");
    }
    next();
  };

  updateContact = (req, res, next) => {
    const {
      params: { contactId }
    } = req;

    const id = this.findContactIndex(contactId);

    const updatedContact = {
      ...contacts[id],
      ...req.body
    };

    contacts[id] = updatedContact;

    res.json(updatedContact);

    next();
  };
}

module.exports = new ContactController();
