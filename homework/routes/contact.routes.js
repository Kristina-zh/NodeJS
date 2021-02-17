const { Router } = require("express");
const ContactController = require("../controllers/contact.controller");

const router = Router();

router.get("/", ContactController.listContacts);
router.get(
  "/:contactId",
  ContactController.validateContactId,
  ContactController.getById
);
router.post(
  "/",
  ContactController.validateAddContact,
  ContactController.addContact
);
router.delete(
  "/:contactId",
  ContactController.validateContactId,
  // ContactController.validateRemoveContact,
  ContactController.removeContact
);
router.patch(
  "/:contactId",
  ContactController.validateContactId,
  ContactController.validateUpdateContact,
  ContactController.updateContact
);

module.exports = router;
