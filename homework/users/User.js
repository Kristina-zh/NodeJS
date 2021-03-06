const mongoose = require("mongoose");

const { Schema } = mongoose;
const { SchemaTypes } = require("mongoose");

const UserSchema = new Schema({
  owner: {
    type: SchemaTypes.ObjectId,
    ref: "user"
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: value => value.includes("@")
  },
  password: {
    type: String,
    required: true
  },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free"
  },
  token: String
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
