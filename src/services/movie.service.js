const movieDao = require("../dao/movie.dao");

function getMovies(callback) {
    movieDao.getAllMovies((err, movies) => {
        if (err) {
            console.error("Error fetching movies:", err);
            return callback([]);
        }
        callback(movies);
    });
}

module.exports = { getMovies };