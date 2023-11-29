require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// routes
const games = require("./routes/games");
const tournaments = require("./routes/tournaments");
const venues = require("./routes/venues");
const players = require("./routes/players");
const pairs = require("./routes/pairs");
const livePositions = require("./routes/live_positions");
const liveMoves = require("./routes/live_moves");
const recordPositions = require("./routes/record_positions");
const recordMoves = require("./routes/record_moves");
const liveStatus = require("./routes/live_status");
const tables = require("./routes/tables");
const detection = require("./routes/detection");
const authentication = require("./routes/authentication");
const admins = require("./routes/admins");
const liveTimer = require("./routes/live_timer");

// middleware
app.use(
  cors({
    origin: `http://${process.env.ORIGIN_IP}:${process.env.ORIGIN_PORT}`,
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// API
app.use("/api/v1/games", games);
app.use("/api/v1/tournaments", tournaments);
app.use("/api/v1/venues", venues);
app.use("/api/v1/players", players);
app.use("/api/v1/pairs", pairs);
app.use("/api/v1/live_positions", livePositions);
app.use("/api/v1/live_moves", liveMoves);
app.use("/api/v1/record_positions", recordPositions);
app.use("/api/v1/record_moves", recordMoves);
app.use("/api/v1/live_status", liveStatus);
app.use("/api/v1/tables", tables);
app.use("/api/v1/detection", detection);
app.use("/api/v1/authentication", authentication);
app.use("/api/v1/admins", admins);
app.use("/api/v1/live_timer", liveTimer);

app.get("/", (req, res) => {
  res.send("Home Page");
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something wrong!");
});

const port = process.env.APP_PORT;

app.listen(port, () => {
  console.log(`server is listening to port ${port}...`);
});
