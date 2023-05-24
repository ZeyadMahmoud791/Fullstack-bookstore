const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");


//router.get("/products/:id", productController.getProductURL);
router.post("/add-product", productController.createProduct);
router.post("/cart", productController.buyProduct);
router.post("/remove", productController.removeProduct);
router.post("/Section", productController.ListProduct);
router.post('/Product', productController.getProduct);
module.exports = router;