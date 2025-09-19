var express = require("express");
var router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const logger = require("../util/logger");

router.get("/login", authController.login)

router.get("/register", authMiddleware.requireAuth, authController.register)
router.post("/register", authMiddleware.requireAuth, authController.postRegister)

router.post("/login", authController.postLogin)

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Uitloggen mislukt.")
        }
        res.redirect("/")
    })
})
module.exports = router;