const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const contactsRouter = require("./contacts/contacts.routes");

dotenv.config();

const PORT = process.env.port || 8080;

start();

function start() {
  const app = initServer();
  connectMiddlewares(app);
  declareRoutes(app);
  connectedToDb();
  listen(app);
}

function initServer() {
  return express();
}

function connectMiddlewares(app) {
  app.use(express.json());
}

function declareRoutes(app) {
  app.use("/api/contacts", contactsRouter);
}

async function connectedToDb() {
  await mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log("Database connection successful");
}

function listen(app) {
  app.listen(PORT, () => {
    console.log("server is listening on port:", PORT);
  });
}
