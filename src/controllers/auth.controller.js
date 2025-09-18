const express = require("express");
const router = express.Router();
const authService = require("../services/auth.service");
const logger = require("../util/logger");

const TAG = "auth.controller"

module.exports = {
    login: (req, res, next) => {
        logger.debug(`${TAG} login page requested`);
        const model = { /* */ }
        const view = "auth/login"
        return res.render(view, model)
    },

    register: (req, res, next) => {
        logger.debug(`${TAG} register page requested`);
        const model = { /* */ }
        const view = "auth/register"
        return res.render(view, model)
    },

    postLogin: (req, res, next) => {
        logger.debug(`${TAG} postLogin`);
        authService.login(req.body, (err, user) => {
            if (err) {
                logger.warn(`${TAG} login failed: ${err.message}`);
                const model = {
                    title: "Login - Beunotheek",
                    error: err.message
                };
                return res.render("auth/login", model);
            } else {
                logger.info(`${TAG} login success for user: ${user.email}`);
                req.session.user = user
                return res.redirect("/");
            }
        })
    },

    postRegister: (req, res, next) => {
        logger.debug(`${TAG} postRegister`);
        logger.debug(`${TAG} Checkbox value: ${req.body.is_active}`);
        authService.register(req.body, (err, user) => {
            if (err) {
                logger.warn(`${TAG} register failed: ${err.message}`);
                return next(err)
            }
            logger.info(`${TAG} register success for user: ${user.email}`);
            req.session.user = user
            return res.redirect("/")
        })

    }
}


