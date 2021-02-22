const { Router } = require("express");
const ContactController = require("./contacts.controller");

const router = Router();

router.get("/", ContactController.listContacts);
router.get(
  "/:contactId",
  ContactController.validateContactId,
  ContactController.getById
);
router.post("/", ContactController.addContact);
router.delete(
  "/:contactId",
  ContactController.validateContactId,
  ContactController.removeContact
);
router.patch(
  "/:contactId",
  ContactController.validateContactId,
  ContactController.validateUpdateContact,
  ContactController.updateContact
);

module.exports = router;
