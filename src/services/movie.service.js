const movieDao = require("../dao/movie.dao");


function getMovies(page, limit, callback) {
    movieDao.getMoviesPaginated(page, limit, (err, movies, totalCount) => {
        if (err) {
            console.error("Error fetching movies:", err);
            return callback([], 0);
        }
        callback(movies, totalCount);
    });
}

function getMovieById(id, callback) {
    movieDao.getMoviesById(id, (err, movies) => {
        if (err) {
            console.error("Error finding movie:", err);
            return callback([]);
        }
        callback(movies);
    });
}

module.exports = { getMovies, getMovieById };