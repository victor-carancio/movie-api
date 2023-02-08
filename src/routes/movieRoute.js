const express = require("express");
const router = express.Router();

const { getAllMovies, searchMovie } = require("../controllers/movieController");

router.get("/", getAllMovies);
router.get("/search", searchMovie);

module.exports = router;
