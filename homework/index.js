const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./users/users.routes");
const contactRouter = require("./contacts/contacts.routes");

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
  app.use("/api/contacts", contactRouter);
  app.use("/api", userRouter);
}

async function connectedToDb() {
  await mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  });
  console.log("Database connection successful");
}

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Connection for DB disconnected");
    process.exit(1);
  });
});

function listen(app) {
  app.listen(PORT, () => {
    console.log("server is listening on port:", PORT);
  });
}
