var express = require("express");
var router = express.Router();
const movieController = require("../controllers/movie.controller");
const logger = require("../util/logger");


router.get("/", movieController.getAllMovies)
router.get("/create", movieController.getCreateMovie);
router.post("/create", movieController.postCreateMovie);
router.get("/:id", movieController.getMovieDetailsById)
router.get("/:id/edit", movieController.getEditMovie);
router.post("/:id/edit", movieController.postEditMovie);
router.post("/:id/delete", movieController.deleteMovie);
module.exports = router;