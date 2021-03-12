const { Router } = require("express");
const UserController = require("./users.controller");

const router = Router();

router.post(
  "/auth/register",
  UserController.validateLogin,
  UserController.register
);
router.post("/auth/login", UserController.authorize, UserController.login);
router.post("/auth/logout", UserController.authorize, UserController.logout);
router.get(
  "/users/current",
  UserController.authorize,
  UserController.validateLogin,
  UserController.currentUser
);

module.exports = router;
