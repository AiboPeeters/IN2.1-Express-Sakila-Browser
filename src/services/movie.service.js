const logger = require("../util/logger");
const movieDao = require("../dao/movie.dao");

const TAG = "movie.service";

function getMovies(page, limit, callback) {
    movieDao.getAllMovies(page, limit, (err, movies, totalCount) => {
        if (err) {
            logger.error(`${TAG} Error fetching movies: ${err}`);
            return callback([], 0);
        }
        logger.debug(`${TAG} Fetched ${movies.length} movies, totalCount: ${totalCount}`);
        callback(movies, totalCount);
    });
}

function getMovieById(id, callback) {
    movieDao.getMoviesById(id, (err, movie) => {
        if (err) {
            logger.error(`${TAG} Error finding movie with id ${id}: ${err}`);
            return callback(null);
        }
        logger.debug(`${TAG} Fetched movie with id ${id}`);
        callback(movie);
    });
}

function updateMovie(id, movie, callback) {
    movieDao.updateMovie(id, movie, (err) => {
        if (err) {
            logger.error(`${TAG} Error updating movie with id ${id}: ${err}`);
            return callback(err);
        }
        logger.info(`${TAG} Movie with id ${id} updated successfully`);
        callback(null);
    });
}

function deleteMovie(id, callback) {
    movieDao.deleteMovie(id, (err) => {
        if (err) {
            logger.error(`${TAG} Error deleting movie with id ${id}: ${err}`);
            return callback(err);
        }
        logger.info(`${TAG} Movie with id ${id} deleted successfully`);
        callback(null);
    });
}

function createMovie(movie, callback) {
    movieDao.createMovie(movie, (err, result) => {
        if (err) {
            logger.error(`${TAG} Error creating movie: ${err}`);
            return callback(err);
        }
        logger.info(`${TAG} Movie created successfully with id ${result.film_id}`);
        callback(null, result);
    });
}

function getAllLanguages(callback) {
    movieDao.getAllLanguages((err, languages) => {
        if (err) {
            logger.error(`${TAG} Error fetching languages: ${err}`);
            return callback(err, null);
        }
        logger.debug(`${TAG} Fetched ${languages.length} languages`);
        callback(null, languages);
    });
}

module.exports = { getMovies, getMovieById, updateMovie, deleteMovie, createMovie, getAllLanguages };