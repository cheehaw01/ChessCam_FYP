const express = require("express");
const router = express.Router();

const { getAllTableNames } = require("../controllers/tables");

router.route("/").get(getAllTableNames);

module.exports = router;
