const mysql = require('mysql2');
const logger = require("../util/logger");

const TAG = "movie.dao";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
});

function getAllMovies(page, limit, callback) {
    logger.debug(TAG, 'getAllMovies');
    const offset = (page - 1) * limit;
    pool.query(
        `SELECT 
            film_id, 
            title, 
            description, 
            image, 
            rental_rate, 
            rental_duration, 
            replacement_cost 
         FROM film 
         LIMIT ? OFFSET ?; 
         SELECT COUNT(*) as count FROM film;`,
        [limit, offset],
        (err, results) => {
            if (err) {
                return callback(err, null, 0);
            }
            const movies = results[0];
            const totalCount = results[1][0].count;
            callback(null, movies, totalCount);
        }
    );
}

function getMoviesById(id, callback) {
    logger.debug(TAG, 'getMovieById', id);
    const sql = `
        SELECT 
            f.film_id, 
            f.title, 
            f.description, 
            f.release_year, 
            f.length, 
            f.rating, 
            f.language_id,
            f.rental_duration,
            f.rental_rate,
            f.replacement_cost,
            f.image,
            l.name AS language
        FROM film f
        LEFT JOIN language l ON f.language_id = l.language_id
        WHERE f.film_id = ?
    `;
    pool.query(sql, [id], (err, results) => {
        if (err) return callback(err, null);
        callback(null, results[0]);
    });
}

function createMovie(movie, callback) {
    logger.debug(TAG, 'addMovie', movie);
    const sql = `
        INSERT INTO film (title, description, release_year, language_id, rental_duration, rental_rate, replacement_cost, length, rating, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        movie.title,
        movie.description,
        movie.release_year,
        movie.language_id,
        movie.rental_duration,
        movie.rental_rate,
        movie.replacement_cost,
        movie.length,
        movie.rating,
        movie.image || '/images/Beunotheek-logo.png',
    ];
    pool.query(sql, params, (err, results) => {
        if (err) return callback(err, null);
        callback(null, { film_id: results.insertId, ...movie });
    });
}

function updateMovie(id, movie, callback) {
    logger.debug(TAG, 'updateMovie', id);

    const sql = `UPDATE film 
                    SET title = ?, 
                        description = ?, 
                        release_year = ?, 
                        language_id = ?, 
                        rental_duration = ?, 
                        rental_rate = ?, 
                        replacement_cost = ?, 
                        length = ?, 
                        rating = ?, 
                        image = ?
                 WHERE film_id = ?`;

    const params = [
        movie.title,
        movie.description,
        movie.release_year,
        movie.language_id,
        movie.rental_duration || 3,
        movie.rental_rate || 4.99,
        movie.replacement_cost || 0,
        movie.length || null,
        movie.rating || null,
        movie.image || '/images/Beunotheek-logo.png',
        id,
    ];

    pool.query(sql, params, (err) => {
        if (err) return callback(err);
        callback(null);
    });
}

function deleteMovie(id, callback) {
    logger.debug(TAG, 'deleteMovie', id);
    const sql = "DELETE FROM film WHERE film_id = ?";
    pool.query(sql, [id], (err) => {
        if (err) return callback(err);
        callback(null);
    });
}

function getAllLanguages(callback) {
    logger.debug(TAG, 'getAllLanguages');
    const sql = "SELECT language_id, name FROM language ORDER BY name";
    pool.query(sql, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
}

function searchMovies(search, callback) {
    logger.debug(TAG, 'searchMovies', search);
    const sql = `
        SELECT 
            film_id, 
            title, 
            description, 
            image, 
            rental_rate, 
            rental_duration 
        FROM film 
        WHERE title LIKE ? 
        LIMIT 20
    `;
    const param = [`%${search}%`];
    pool.query(sql, param, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
}

module.exports = {
    getAllMovies,
    getMoviesById,
    createMovie,
    updateMovie,
    deleteMovie,
    getAllLanguages,
    searchMovies,
};
