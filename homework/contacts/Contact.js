const mongoose = require("mongoose");

const { Schema } = mongoose;

const ContactSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: value => value.includes("@")
  },
  phone: {
    type: String,
    unique: true,
    required: true
  },
  subscription: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
