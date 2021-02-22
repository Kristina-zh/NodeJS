const {
  Types: { ObjectId }
} = require("mongoose");

const Contact = require("./Contact");
const Joi = require("joi");

function validateContactId(req, res, next) {
  const {
    params: { contactId }
  } = req;

  if (!ObjectId.isValid(contactId)) {
    return res.status(400).send("Your id is not valid");
  }

  next();
}

async function listContacts(req, res) {
  const contacts = await Contact.find();
  res.json(contacts);
}

async function getById(req, res, next) {
  const {
    params: { contactId }
  } = req;

  const getUser = await Contact.findById(contactId);

  if (!getUser) {
    return res.status(400).send("Contact is not found");
  }

  res.json(getUser);
  next();
}

async function addContact(req, res) {
  try {
    const { body } = req;
    const contact = await Contact.create(body);
    res.json(contact);
  } catch (error) {
    if (error.keyPattern) {
      if (error.keyPattern.email) {
        res.status(400).send('Поле "email" має бути унікальним');
      }
      if (error.keyPattern.phone) {
        res.status(400).send('Поле "phone" має бути унікальним');
      }
    } else console.log("error2 :", error);
    res.status(400).send(error);
  }
}

async function removeContact(req, res, next) {
  const {
    params: { contactId }
  } = req;

  const removeContact = await Contact.findByIdAndDelete(contactId);

  if (!removeContact) {
    return res.status(400).send("Contact is not found");
  }

  res.json(removeContact);

  next();
}

validateUpdateContact = (req, res, next) => {
  const validationRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    subscription: Joi.string(),
    password: Joi.string()
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send("missing fields");
  }
  next();
};

async function updateContact(req, res, next) {
  const {
    params: { contactId }
  } = req;

  const updateContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true
  });

  console.log("updateContact :", updateContact);

  if (!updateContact) {
    return res.status(400).send("Contact isn't found");
  }
  res.json(updateContact);

  next();
}

module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
  validateContactId,
  validateUpdateContact
};
