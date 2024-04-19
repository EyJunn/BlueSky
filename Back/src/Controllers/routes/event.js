const express = require("express");
const {
  createEvent,
  getAllEvent,
  getMyEvent,
  updateEvent,
  deleteEvent,
  addParticipant,
  retirerParticipant,
} = require("../eventController");
const { extractToken } = require("../../Utils/extractToken");

const router = express.Router();

router.route("/create").post(createEvent);
router.route("/all").get(getAllEvent);
router.route("/myCreation", extractToken).get(getMyEvent);
router.route("/update/:id").patch(updateEvent);
router.route("/delete/:id").delete(deleteEvent);
router.route("/addParticipant/:id").put(addParticipant);
router.route("/retirerParticipant/:id").patch(retirerParticipant);

module.exports = router;
