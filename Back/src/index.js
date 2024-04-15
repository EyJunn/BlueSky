const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("./Services/Connection");
const userRoutes = require("./Controllers/routes/users");
const eventRoutes = require("./Controllers/routes/event");

app.use(express.json());
app.use(cors());

connect(process.env.DB_URL, (error) => {
  if (error) {
    console.log("Failed to connect");
    process.exit(-1);
  } else {
    console.log("successfully connected");
  }
});

app.use("/user", userRoutes);
app.use("/", eventRoutes);

console.log("(🌸◕ワ◕)(⁄ ⁄◕⁄ω⁄◕⁄ ⁄✿)");
app.listen(3004);
