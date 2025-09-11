const express = require("express");
const router = express.Router();
const movieService = require("../services/movie.service")

function getAllMovies(req, res, next) {
    //vanaf hier gaan we naar de services laag.
    const model = { title: "movies" };
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;

    movieService.getMovies(page, limit, (movies, totalCount) => {
        const totalPages = Math.ceil(totalCount / limit);
        const model = {
            title: "Beschikbare Films",
            movies: movies,
            page,
            limit,
            totalPages
        };
        const view = "movies"
        res.render(view, model);
    });
};

function getMovie(req, res, next) {

    const model = { title: "moviesDetails" };
    const id = req.params.id;

    movieService.getMovieById(id, (moviesDetails) => {
        const model = {
            title: "Film Details",
            moviesDetails: moviesDetails
        };
        const view = "moviesDetails"
        res.render(view, model);
    })
}

module.exports = { getAllMovies, getMovie };