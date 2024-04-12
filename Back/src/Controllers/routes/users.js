const express = require("express");
const { login, register } = require("../usersController");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
