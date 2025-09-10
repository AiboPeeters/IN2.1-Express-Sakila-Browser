const express = require("express");
const router = express.Router();
const movieService = require("../services/movie.service")

function getAllMovies(req, res, next) {

    //vanaf hier gaan we naar de services laag.
    const model = { title: "movies" };

    movieService.getMovies((movies) => {
        //hier komt data terug van de service laag -> model
        const model = {
            title: "movielist",
            movies: movies
        };
        const view = "movies"
        res.render(view, model);
    });

};

module.exports = { getAllMovies };