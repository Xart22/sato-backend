const router = require("express").Router();
const categoryCtrl = require("../controllers/categoryControllers");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/category")
  .get(categoryCtrl.getCategory)
  .post(auth, authAdmin, categoryCtrl.createCategory);

router.route("/category/:id").delete(auth, authAdmin, categoryCtrl.delete);

module.exports = router;
