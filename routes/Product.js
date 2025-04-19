const express = require("express");
const { createProduct, getProductsByCategory, getProductById } = require("../controllers/Product");
const router = express.Router();

router.post("/createproduct", createProduct);
router.get("/get-product/:categoryId", getProductsByCategory);
router.get("/get-product-by-id/:productId", getProductById);

module.exports = router;
