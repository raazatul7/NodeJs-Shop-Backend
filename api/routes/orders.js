const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Orders get",
  });
});

router.post("/", (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };
  res.status(201).json({
    message: "Order Created!",
    createdOrder: order,
  });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  if (id === "special") {
    res.status(200).json({
      message: "Special product found!",
      id: id,
    });
  } else {
    res.status(200).json({
      message: "Product order!!",
      id: id,
    });
  }
});

router.patch("/", (req, res, next) => {
  res.status(200).json({
    message: "Updated order",
  });
});

router.delete("/", (req, res, next) => {
  res.status(200).json({
    message: "Deleted order",
  });
});

module.exports = router;
