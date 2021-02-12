const router = require("express").Router();
const categoryCtrl = require("../controllers/categoryControllers");

router.route("/category").get(categoryCtrl.getCategory);

module.exports = router;
