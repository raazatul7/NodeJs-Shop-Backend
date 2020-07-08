const express = require("express");
const Order = require("../models/order");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name price")
    .exec()
    .then((result) => {
      if (result.length <= 0) {
        return res.status(404).json({
          message: "Orders not found!",
        });
      }
      res.status(200).json({
        message: "Orders found successfully.",
        count: result.length,
        order: result,
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/", (req, res, next) => {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    product: req.body.productId,
    quantity: req.body.quantity,
  });
  order
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Order Created!",
        createdOrder: result,
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product", "name price")
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "Order not found!",
        });
      }
      res.status(200).json({
        message: "Order found!",
        order: result,
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.patch("/", (req, res, next) => {
  res.status(200).json({
    message: "Updated order",
  });
});

router.delete("/:orderId", (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted!",
        order: result,
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;
