const {
  Types: { ObjectId }
} = require("mongoose");
const jwt = require("jsonwebtoken");

const Contact = require("./Contact");
const User = require("../users/User");

const Joi = require("joi");

async function authorize(req, res, next) {
  const authorizationHeader = req.get("Authorization");
  if (!authorizationHeader) {
    return res.status(401).send("Not authorized");
  }
  const token = authorizationHeader.replace("Bearer ", "");

  const payload = await jwt.verify(token, process.env.JWT_SECRET);
  const { userId } = payload;
  req.userId = userId;

  console.log("userId :", userId);

  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = payload;

    const user = await User.findById(userId);
    req.user = user;
    if (!user) {
      return res.status(401).send("Not authorized");
    }

    next();
  } catch (err) {
    return res.status(401).send("Not authorized");
  }
}

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
  const { userId } = req;
  // const page = 1;
  // const PAGE_SIZE = 20;
  console.log("userID :", userId);
  const contacts = await Contact.find({
    owner: userId
  });
  //   // .sort({ age: -1 })
  //   .skip((page - 1) * PAGE_SIZE)
  //   .limit(PAGE_SIZE);
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
    const { body, user } = req;
    console.log("user :", user);
    const contact = await Contact.create({ ...body, owner: user.id });
    console.log("contact :", contact);
    res.json(contact);
  } catch (error) {
    if (error.keyPattern) {
      if (error.keyPattern.email) {
        res.status(400).send('Поле "email" має бути унікальним');
      }
      if (error.keyPattern.phone) {
        res.status(400).send('Поле "phone" має бути унікальним');
      }
    } else res.status(400).send(error);
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
  validateUpdateContact,
  authorize
};
