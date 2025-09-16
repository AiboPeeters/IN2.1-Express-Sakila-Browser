var express = require("express");
var router = express.Router();
const authController = require("../controllers/auth.controller");
const logger = require("../util/logger");

router.get("/login", authController.login)
router.get("/register", authController.register)

router.post("/login", authController.postLogin)
router.post("/register", authController.postRegister)

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Uitloggen mislukt.")
        }
        res.redirect("/")
    })
})
module.exports = router;