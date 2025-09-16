const express = require("express");
const router = express.Router();
const authService = require("../services/auth.service");
const logger = require("../util/logger");

const TAG = "auth.controller"

module.exports = {
    login: (req, res, next) => {
        logger.debug(`${TAG} login`)
        const model = { /* */ }
        const view = "auth/login"
        return res.render(view, model)
    },

    register: (req, res, next) => {
        logger.debug(`${TAG} register`)
        const model = { /* */ }
        const view = "auth/register"
        return res.render(view, model)
    },

    postLogin: (req, res, next) => {
        logger.debug(`${TAG} postLogin`)
        authService.login(req.body, (err, user) => {
            if (err) {
                const model = {
                    title: "Login - Beunotheek",
                    error: err.message
                };
                return res.render("auth/login", model);
            } else {
                req.session.user = user
                return res.redirect("/");
            }
        })
    },

    postRegister: (req, res, next) => {
        logger.debug(`${TAG} postRegister`)
        console.log("Checkbox value:", req.body.is_active);
        authService.register(req.body, (err, user) => {
            if (err) {
                return next(err)
            }
            req.session.user = user
            return res.redirect("/")
        })

    }
}


