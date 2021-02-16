const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const contactRouter = require("./hw2/routes/contact.routes.js");

const PORT = process.env.port || 8080;

class Server {
  constructor() {
    this.server = null;
  }

  start() {
    this.server = express();
    this.initMiddlewares();
    this.initRoutes();
    this.listen();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(
      cors({
        origin: "*"
      })
    );
  }

  initRoutes() {
    this.server.use("/api/contacts", contactRouter);
  }

  listen() {
    this.server.listen(PORT, () => {
      console.log("Server is listening:", PORT);
    });
  }
}

const server = new Server();

server.start();
