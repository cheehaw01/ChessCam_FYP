require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routes
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
const input = require("./routes/input");

// Middleware
app.use(
  cors({
    origin: `http://${process.env.ORIGIN_IP}:${process.env.ORIGIN_PORT}`,
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../frontend/build")));

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
app.use("/api/v1/input", input);

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something wrong!");
});

// Instantiate CountDownTimerPair and initiate the timer
const CountDownTimerPair = require("./timer/CountDownTimerPair");
const pairTimer = new CountDownTimerPair();
pairTimer.initiateTimer();

const port = process.env.APP_PORT || 5000;

app.listen(port, () => {
  console.log(`server is listening to port ${port}...`);
});
