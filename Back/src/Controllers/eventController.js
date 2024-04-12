const { Listing } = require("../Models/Event");
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
    let listing = new Listing(
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
      .db("lebonEndroit")
      .collection("listing")
      .insertOne(listing);
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
      let listings = await client
        .db("lebonEndroit")
        .collection("listing")
        .find({ userId: authData.id });
      let apiResponse = await listings.toArray();

      res.status(200).json(apiResponse);
    }
  });
};

const getAllEvent = async (request, response) => {
  let listings = await client.db("lebonEndroit").collection("listing").find();

  let apiResponse = await listings.toArray();
  response.status(200).json(apiResponse);
};

const deleteEvent = async (request, response) => {
  if (!request.body.userId || !request.body.listingId) {
    response.status(400).json({ error: "Some fields are missing" });
    return;
  }
  let listingId = new ObjectId(request.body.listingId);
  let userId = new ObjectId(request.body.userId);

  let user = await client
    .db("lebonEndroit")
    .collection("user")
    .find({ _id: userId });

  let listing = await client
    .db("lebonEndroit")
    .collection("listing")
    .find({ _id: listingId });

  if (!user || !listing) {
    response.status(401).json({ error: "Unauthorized mothafucker" });
    return;
  }

  if (listing.userId !== user._id || user.role !== "admin") {
    response.status(401).json({ error: "Unauthorized mothafucker" });
    return;
  }

  try {
    await client
      .db("lebonEndroit")
      .collection("listing")
      .deleteOne({ _id: listingId });
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
    .db("lebonEndroit")
    .collection("user")
    .find({ _id: request.body.userId });

  let listing = await client
    .db("lebonEndroit")
    .collection("listing")
    .find({ _id: request.body.listingId });

  if (!user || !listing) {
    response.status(401).json({ error: "Unauthorized mothafucker" });
    return;
  }

  if (listing.userId !== user._id || user.role !== "admin") {
    response.status(401).json({ error: "Unauthorized mothafucker" });
    return;
  }

  try {
    await client
      .db("lebonEndroit")
      .collection("listing")
      .updateOne(
        { _id: listing._id },
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
