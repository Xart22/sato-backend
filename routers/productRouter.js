const router = require("express").Router();
const productCtrl = require("../controllers/productControllers");

router
  .route("/products")
  .get(productCtrl.getProducts)
  .post(productCtrl.creteProducts);

router
  .route("/products/:id")
  .delete(productCtrl.deleteProducts)
  .put(productCtrl.updateProducts);

module.exports = router;
