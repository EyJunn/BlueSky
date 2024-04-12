const express = require("express");
const {
  createEvent,
  getAllEvent,
  getMyEvent,
  updateEvent,
  deleteEvent,
} = require("../eventController");
const { verifyToken } = require("../../Utils/extractToken");

const router = express.Router();

router.route("/create").post(createEvent);
router.route("/all").get(getAllEvent);
router.route("/mine", verifyToken).post(getMyEvent);
router.route("/update").patch(updateEvent);
router.route("/delete").delete(deleteEvent);

module.exports = router;
