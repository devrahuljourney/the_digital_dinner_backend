const express = require("express");
const { createOrder, getOrdersByPhone } = require("../controllers/Order");
const router = express.Router();
router.post("/createorder", createOrder)

router.get("/getorder/:phone", getOrdersByPhone)

module.exports = router;
