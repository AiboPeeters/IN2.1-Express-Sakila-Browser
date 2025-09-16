const logger = require("../util/logger");
const movieDao = require("../dao/movie.dao");

const TAG = "movie.service";

function getMovies(page, limit, callback) {
    movieDao.getAllMovies(page, limit, (err, movies, totalCount) => {
        if (err) {
            logger.error(TAG, "Error fetching movies", err);
            return callback([], 0);
        }
        logger.debug(TAG, "Fetched ${movies.length} movies, totalCount: ${totalCount}");
        callback(movies, totalCount);
    });
}

function getMovieById(id, callback) {
    movieDao.getMoviesById(id, (err, movie) => {
        if (err) {
            logger.error(TAG, "Error finding movie with id ${id}", err);
            return callback(null);
        }
        callback(movie);
    });
}

function updateMovie(id, movie, callback) {
    movieDao.updateMovie(id, movie, (err) => {
        if (err) {
            logger.error(TAG, "Error updating movie with id ${id}", err);
            return callback(err);
        }
        logger.info(TAG, "Movie with id ${id} updated successfully");
        callback(null);
    });
}

function deleteMovie(id, callback) {
    movieDao.deleteMovie(id, callback, (err) => {
        if (err) {
            logger.error(TAG, "Error deleting movie with id ${id}", err);
            return callback(err);
        }
        logger.info(TAG, "Movie was deleted successfully");
        callback(null);
    });
}

function createMovie(movie, callback) {
    movieDao.createMovie(movie, callback, (err) => {
        if (err) {
            logger.error(TAG, "Error deleting movie with id ${id}", err);
            return callback(err);
        }
        logger.info(TAG, "Movie was deleted successfully");
    });
}

function getAllLanguages(callback) {
    movieDao.getAllLanguages(callback);
}

module.exports = { getMovies, getMovieById, updateMovie, deleteMovie, createMovie, getAllLanguages };