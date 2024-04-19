const { Event } = require("../Models/Event");
const client = require("../Services/Connection");
const { ObjectId } = require("bson");
const { extractToken } = require("../Utils/extractToken");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createEvent = async (request, response) => {
  const token = await extractToken(request);

  jwt.verify(token, process.env.My_Secret_Key, async (err, authData) => {
    if (err) {
      console.log(err);
      res.status(401).json({ err: "Unauthorized" });
      return;
    } else {
      if (
        !request.body.title ||
        !request.body.description ||
        !request.body.image ||
        !request.body.category
      ) {
        response.status(400).json({ error: "Some fields are missing" });
      }

      try {
        let event = new Event(
          request.body.title,
          request.body.description,
          request.body.image,
          request.body.category,
          authData.id,
          new Date(),
          "published",
          request.body.participantMax,
          authData.id
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
    }
  });
};

const getMyEvent = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.My_Secret_Key, async (err, authData) => {
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
  const token = await extractToken(request);

  jwt.verify(token, process.env.My_Secret_Key, async (err, authData) => {
    if (err) {
      console.log(err);
      response.status(401).json({ err: "Unauthorized" });
      return;
    } else {
      if (!request.params.id) {
        response.status(400).json({ msg: "Miss Id" });
      }
      let id = new ObjectId(request.params.id);

      let annonceSupprimer = await client
        .db("BlueSky")
        .collection("event")
        .deleteOne({ _id: id });

      let res = await annonceSupprimer;

      if (res.deletedCount === 1) {
        response.status(200).json({ msg: "Suppression réussit" });
      } else {
        response.status(204).json({ msg: "Invalid activity" });
      }
    }
  });
};

const updateEvent = async (request, response) => {
  if (
    !request.body.title ||
    !request.body.description ||
    !request.body.image ||
    !request.body.category ||
    !request.body.userId
  ) {
    response.status(400).json({ error: "Some fields are missing" });
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

  if (event.userId !== user._id && user.role !== "admin") {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }
  response.status(200).json({ msg: "Updated" });

  try {
    await client
      .db("BlueSky")
      .collection("event")
      .updateOne(
        { _id: eventId },
        {
          $set: {
            title: request.body.title,
            description: request.body.description,
            image: request.body.image,
            category: request.body.category,
            participantMax: request.body.participantMax,
          },
        }
      );
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
};

const addParticipant = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.My_Secret_Key, async (err, authData) => {
    if (err) {
      console.log(err);
      res.status(401).json({ err: "Unauthorized" });
      return;
    } else {
      const id = new ObjectId(req.params.id);

      try {
        let bouga = await client
          .db("BlueSky")
          .collection("event")
          .updateOne(
            { _id: id },
            {
              $addToSet: {
                participant: authData.id,
              },
            }
          );
        res.status(200).json({ msg: "Ajout Réussit" });
      } catch (e) {
        res.status(500).json(e);
      }
    }
  });
};

const retirerParticipant = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.My_Secret_Key, async (err, authData) => {
    if (err) {
      console.log(err);
      res.status(401).json({ err: "Unauthorized" });
      return;
    } else {
      const id = new ObjectId(req.params.id);

      try {
        let bougabouga = await client
          .db("BlueSky")
          .collection("event")
          .updateOne(
            { _id: id },
            {
              $pull: { participant: authData.id },
            }
          );
        res.status(200).json({ msg: "Participant retiré" });
      } catch {
        res.status(500).json({ msg: "Pas d'event pour cet id" });
      }
    }
  });
};

module.exports = {
  createEvent,
  updateEvent,
  getAllEvent,
  getMyEvent,
  deleteEvent,
  addParticipant,
  retirerParticipant,
};
