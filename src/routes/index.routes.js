var express = require("express");
var router = express.Router();
const logger = require("../util/logger");

/* GET home page. */
router.get("/", function (req, res, next) {
  const model = { title: "Beunotheek" };
  const view = "index"
  res.render(view, model);
});

router.get("/about", function (req, res, next) {
  const model = { title: "Over ons" };
  const view = "about"
  res.render(view, model);
});

module.exports = router;
