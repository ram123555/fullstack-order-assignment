const express = require("express");

const {
  createOrder,
  getOrders,
  getOrder,
  retryOrder
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/:id", getOrder);

router.post("/:id/retry", retryOrder);

module.exports = router;