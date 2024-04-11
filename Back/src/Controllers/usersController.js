const { User } = require("../Models/Users");
const client = require("../Services/Connection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
require("dotenv").config();
