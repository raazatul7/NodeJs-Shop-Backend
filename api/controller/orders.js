const Order = require("../models/order");
const mongoose = require("mongoose");

exports.orders_get_all = (req, res, next) => {
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
};

exports.orders_post = (req, res, next) => {
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
};

exports.orders_get_one = (req, res, next) => {
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
};
