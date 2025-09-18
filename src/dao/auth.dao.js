const mysql = require('mysql2');
const logger = require("../util/logger");

const TAG = "auth.dao";

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

module.exports = {
    findUserByEmail(email, callback) {
        logger.debug(`${TAG} findUserByEmail: ${email}`);

        const sql = "SELECT email, password, username FROM staff WHERE email = ?;";
        pool.query(sql, [email], (err, results) => {
            if (err) {
                logger.error(`${TAG} findUserByEmail error: ${err}`);
                return callback(err, null);
            }

            if (results.length > 0) {
                logger.debug(`${TAG} User found for email: ${email}`);
                callback(null, results[0]);
            } else {
                logger.debug(`${TAG} No user found for email: ${email}`);
                callback(null, null);
            }
        });
    },

    createUser(user, callback) {
        logger.debug(`${TAG} createUser: ${user.email}`);

        const sql = `
        INSERT INTO staff 
        (first_name, last_name, address_id, store_id, active, email, username, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

        pool.query(sql, [
            user.first_name,
            user.last_name,
            user.address_id,
            user.store_id,
            user.is_active ? 1 : 0,
            user.email,
            user.username,
            user.password
        ], (err, result) => {
            if (err) {
                logger.error(`${TAG} createUser error: ${err}`);
                return callback(err, null);
            }

            logger.info(`${TAG} User created with id: ${result.insertId}`);
            callback(null, { id: result.insertId, ...user });
        });
    }

};

