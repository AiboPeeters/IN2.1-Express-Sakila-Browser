const logger = require("../util/logger");
const authDao = require("../dao/auth.dao");

const TAG = "auth.service";

module.exports = {
    login(credentials, callback) {
        credentials = {
            email: credentials.email,
            password: credentials.password
        };

        logger.debug(`${TAG} - login called with: ${credentials.email}`);

        authDao.findUserByEmail(credentials.email, (err, user) => {
            if (err) {
                logger.error(`${TAG} - error in DAO: ${err}`);
                return callback(err, null);
            }

            if (!user) {
                logger.warn(`${TAG} - user not found: ${credentials.email}`);
                return callback({ message: "User not found" }, null);
            }

            if (user.password !== credentials.password) {
                logger.warn(`${TAG} - invalid password for: ${credentials.email}`);
                return callback({ message: "Invalid credentials" }, null);
            }

            logger.info(`${TAG} - login success: ${credentials.email}`);
            return callback(null, user);
        });
    },

    register(credentials, callback) {
        credentials = {
            first_name: credentials.first_name,
            last_name: credentials.last_name,
            address_id: credentials.address_id || 1,
            store_id: credentials.store_id || 1,
            active: credentials.is_active ? 1 : 0,
            email: credentials.email,
            username: credentials.username,
            password: credentials.password
        };

        logger.debug(`${TAG} - register called with: ${credentials.email}`);

        authDao.findUserByEmail(credentials.email, (err, existingUser) => {
            if (err) {
                logger.error(`${TAG} - error in DAO: ${err}`);
                return callback(err, null);
            }

            if (existingUser) {
                logger.warn(`${TAG} - email already in use: ${credentials.email}`);
                return callback({ message: "Email already registered" }, null);
            }

            authDao.createUser(credentials, (err, newUser) => {
                if (err) {
                    logger.error(`${TAG} - error creating user: ${err}`);
                    return callback(err, null);
                }

                logger.info(`${TAG} - register success: ${credentials.email}`);
                return callback(null, newUser);
            });
        });
    }
};
