const express = require("express");
const router = express.Router();
const OrdersController = require("../controller/orders");
const checkAuth = require("../middleware/check-auth");

//Routes for orders
router.get("/", checkAuth, OrdersController.orders_get_all);

router.post("/", checkAuth, OrdersController.orders_post);

router.get("/:orderId", checkAuth, OrdersController.orders_get_one);

module.exports = router;
