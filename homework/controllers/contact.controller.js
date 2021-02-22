const Joi = require("joi");
const { MongoClient, ObjectID } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const MONGO_URL = `mongodb+srv://admin:${DB_PASSWORD}@cluster0.sdulz.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

let users;

start();

async function start() {
  const client = await MongoClient.connect(MONGO_URL);
  const db = client.db();

  users = db.collection("users");
}

class ContactController {
  validateContactId = (req, res, next) => {
    const {
      params: { contactId }
    } = req;

    if (!ObjectID.isValid(contactId)) {
      return res.status(400).send("Your id is not valid");
    }
    next();
  };

  async listContacts(req, res) {
    const data = await users.find().toArray();
    res.json(data);
  }

  async getById(req, res, next) {
    const {
      params: { contactId }
    } = req;

    const getUser = await users.findOne({
      _id: ObjectID(contactId)
    });

    res.json(getUser);
    next();
  }

  async addContact(req, res) {
    const { body } = req;
    const data = await users.insertOne(body);
    res.json(data.ops[0]);
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

  async removeContact(req, res, next) {
    const {
      params: { contactId }
    } = req;

    const deletedUser = await users.deleteOne({
      _id: ObjectID(contactId)
    });

    res.json(deletedUser);

    next();
  }

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

  async updateContact(req, res, next) {
    const {
      params: { contactId }
    } = req;

    const updatedUser = await users.updateOne(
      {
        _id: ObjectID(contactId)
      },
      {
        $set: req.body
      }
    );

    res.json(updatedUser);

    next();
  }
}

module.exports = new ContactController();
