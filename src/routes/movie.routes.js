var express = require("express");
var router = express.Router();

const movieController = require("../controllers/movie.controller")
/* GET home page. */
router.get("/", movieController.getAllMovies)
router.get("/:id", movieController.getMovie)
module.exports = router;