// // const contacts = require("./contacts");
// // const { removeContact } = require("./contacts");
// // const argv = require("yargs").argv;

// // const { require } = require("yargs");

// // function invokeAction({ action, id, name, email, phone }) {
// //   switch (action) {
// //     case "list":
// //       return contacts.listContacts();
// //       break;

// //     case "get":
// //       return contacts.getContactById(id);
// //       break;

// //     case "add":
// //       return contacts.addContact(name, email, phone);
// //       break;

// //     case "remove":
// //       return removeContact(id);
// //       break;

// //     default:
// //       console.warn("\x1B[31m Unknown action type!");
// //   }
// // }

// // invokeAction(argv);

// // Нативное подключение

// // const http = require("http");

// // const PORT = 8080;

// // const server = http.createServer((request, response) => {
// //   console.log("url", request.url);
// //   console.log("method", request.method);
// //   console.log("headers", request.headers);

// //   let result = "";

// //   request.on("data", data => {
// //     result += data;
// //   });

// //   request.on("end", () => {
// //     response.end(result);
// //   });
// // });

// // server.listen(PORT, () => {
// //   console.log("Server is listening on port:", PORT);
// // });

// //-----------------------------------------------------
// const express = require("express");
// const Joi = require("joi");
// const fetch = require("node-fetch");
// const dotenv = require("dotenv");
// const cors = require("cors");

// dotenv.config();

// const PORT = process.env.PORT || 8080;
// const server = express();

// const API_KEY = process.env.OPEN_WEATHER_API_KEY;
// console.log("API_KEY :", API_KEY);

// // server.use(express.json());
// // server.use(express.urlencoded());

// // server.use((req, res, next) => {
// //   console.log("Hello from common middleware");
// //   res.set("Cookie", "name=Jason");
// //   next();
// // });

// // server.get("/users", (req, res, next) => {
// //   console.log("Hello from middleware users");
// //   next();
// // });

// // server.post("/comments", (req, res) => {
// //   console.log("body :", req.body);
// //   res.send(req.body);
// // });

// server.use(
//   cors({
//     origin: "localhost: 8080"
//   })
// );

// server.get("/weather", validateWeatherParams, async (req, res) => {
//   // console.log("query :", req.query);
//   const {
//     query: { lat, lon }
//   } = req;

//   // res.send(req.query);

//   const result = await fetch(
//     `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
//   );
//   const data = await result.json();
//   res.json(data);
// });

// // function validateWeatherParams(req, res, next) {
// //   const {
// //     query: { lat, lon }
// //   } = req;
// //   if (typeof lat !== "string" || typeof lon !== "string") {
// //     return res.status("400").send("One of geo coordinates is missed");
// //   }
// //   next();
// // }

// function validateWeatherParams(req, res, next) {
//   const validationRules = Joi.object({
//     lat: Joi.string().required(),
//     lon: Joi.string().required()
//   });

//   const validationResult = validationRules.validate(req.query);

//   if (validationResult.error) {
//     return res.status(400).send(validationResult.error);
//   }

//   next();
// }

// server.listen(PORT, () => {
//   console.log("Server is listening on PORT:", PORT);
// });
