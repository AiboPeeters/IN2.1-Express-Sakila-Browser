const mysql = require('mysql2');

// Create a connection pool
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

module.exports = pool;

function getAllMovies(callback) {
    pool.query("SELECT title, description, film_id FROM film", (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
}

function getMoviesPaginated(page, limit, callback) {
    const offset = (page - 1) * limit;
    pool.query(
        "SELECT title, description, film_id FROM film LIMIT ? OFFSET ?; SELECT COUNT(*) as count FROM film;",
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
    pool.query("SELECT * FROM film WHERE film_id = ?", [id], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results[0]);
    });
}

module.exports = { getAllMovies, getMoviesById, getMoviesPaginated };