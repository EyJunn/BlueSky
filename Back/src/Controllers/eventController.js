const { event } = require("../Models/Event");
const client = require("../Services/Connection");
const { ObjectId } = require("bson");
const { extractToken } = require("../Utils/extractToken");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createEvent = async (request, response) => {
  if (
    !request.body.title ||
    !request.body.description ||
    !request.body.price ||
    !request.body.image ||
    !request.body.category ||
    !request.body.userId
  ) {
    response.status(400).json({ error: "Some fields are missing" });
  }

  try {
    let event = new event(
      request.body.title,
      request.body.description,
      request.body.image,
      request.body.price,
      request.body.category,
      request.body.userId,
      new Date(),
      "published"
    );

    let result = await client
      .db("BlueSky")
      .collection("event")
      .insertOne(event);
    response.status(200).json(result);
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
};

const getMyEvent = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.MY_SUPER_SECRET_KEY, async (err, authData) => {
    if (err) {
      console.log(err);
      res.status(401).json({ err: "Unauthorized" });
      return;
    } else {
      let events = await client
        .db("BlueSky")
        .collection("event")
        .find({ userId: authData.id });
      let apiResponse = await events.toArray();

      res.status(200).json(apiResponse);
    }
  });
};

const getAllEvent = async (request, response) => {
  let events = await client.db("BlueSky").collection("event").find();

  let apiResponse = await events.toArray();
  response.status(200).json(apiResponse);
};

const deleteEvent = async (request, response) => {
  if (!request.body.userId || !request.body.eventId) {
    response.status(400).json({ error: "Some fields are missing" });
    return;
  }
  let eventId = new ObjectId(request.body.eventId);
  let userId = new ObjectId(request.body.userId);

  let user = await client
    .db("BlueSky")
    .collection("user")
    .find({ _id: userId });

  let event = await client
    .db("BlueSky")
    .collection("event")
    .find({ _id: eventId });

  if (!user || !event) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (event.userId !== user._id || user.role !== "admin") {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    await client.db("BlueSky").collection("event").deleteOne({ _id: eventId });
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
};

const updateEvent = async (request, response) => {
  if (
    !request.body.title ||
    !request.body.description ||
    !request.body.price ||
    !request.body.image ||
    !request.body.userId
  ) {
    response.status(400).json({ error: "Some fields are missing" });
  }

  let user = await client
    .db("BlueSky")
    .collection("user")
    .find({ _id: request.body.userId });

  let event = await client
    .db("BlueSky")
    .collection("event")
    .find({ _id: request.body.eventId });

  if (!user || !event) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (event.userId !== user._id || user.role !== "admin") {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    await client
      .db("BlueSky")
      .collection("event")
      .updateOne(
        { _id: event._id },
        {
          $set: {
            title: request.body.title,
            description: request.body.description,
            image: request.body.image,
            price: request.body.price,
            category: request.body.category,
            status: request.body.status,
          },
        }
      );
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
};

module.exports = {
  createEvent,
  updateEvent,
  getAllEvent,
  getMyEvent,
  deleteEvent,
};
