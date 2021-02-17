// const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync(path.join(__dirname, "../models/contacts.json"));
const db = low(adapter);

const contacts = db.get("contacts");

class ContactController {
  findContactIndex(contactId) {
    const findId = +contactId;
    return findId;
  }

  validateContactId = (req, res, next) => {
    const {
      params: { contactId }
    } = req;

    const id = this.findContactIndex(contactId);

    const idArr = db
      .get("contacts")
      .value()
      .map(i => i.id);

    if (!idArr.includes(id)) {
      return res.status(404).send("Not found");
    }
    next();
  };

  listContacts = (req, res, next) => {
    res.json(contacts);
  };

  getById = (req, res, next) => {
    const {
      params: { contactId }
    } = req;

    const findId = this.findContactIndex(contactId);

    res.send(
      db
        .get("contacts")
        .find({ id: findId })
        .value()
    );
  };

  async addContact(req, res) {
    const { body } = req;

    const idArrLength = db
      .get("contacts")
      .value()
      .map(i => i.id).length;

    const addContact = {
      id: idArrLength + 1,
      ...body
    };

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
    }).min(1);

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send("missing required name field");
    }
    next();
  }

  removeContact = (req, res, next) => {
    const {
      params: { contactId }
    } = req;

    const findId = this.findContactIndex(contactId);

    db.get("contacts")
      .remove({ id: findId })
      .write();

    res.status(200).json("contact deleted");
    next();
  };

  validateUpdateContact = (req, res, next) => {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string()
    }).min(1);

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
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
