const { User } = require("../Models/Users");
const client = require("../Services/Connection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (request, response) => {
  if (
    !request.body.firstName ||
    !request.body.lastName ||
    !request.body.email ||
    !request.body.password
  ) {
    response.status(400).json({ error: "Some fields are missing" });
  }

  const hashedPassword = await bcrypt.hash(request.body.password, 10);
  try {
    let user = new User(
      request.body.firstName,
      request.body.lastName,
      "user",
      request.body.email,
      hashedPassword,
      new Date(),
      new Date(),
      true
    );

    let result = await client.db("BlueSky").collection("user").insertOne(user);
    response.status(200).json(result);
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
};

const login = async (request, response) => {
  if (!request.body.email || !request.body.password) {
    response.status(400).json({ error: "Some fields are missing" });
    return;
  }

  let user = await client
    .db("BlueSky")
    .collection("user")
    .findOne({ email: request.body.email });

  if (!user) {
    response.status(401).json({ error: "Wrong credentials" });
    return;
  }

  const isValidPasswod = bcrypt.compare(request.body.password, user.password);

  if (!isValidPasswod) {
    response.status(401).json({ error: "Wrong credentials" });
  } else {
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        gdpr: new Date(user.gdpr).toLocaleString("fr"),
      },
      process.env.My_Secret_Key,
      { expiresIn: "20d" }
    );

    response.status(200).json({ jwt: token });
  }
};

module.exports = { register, login };
