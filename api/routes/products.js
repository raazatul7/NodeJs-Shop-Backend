const express = require("express");
const Product = require("../models/products");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((result) => {
      console.log("Product.find result=>", result);
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({
          message: "No Product found!",
        });
      }
    })
    .catch((err) => {
      console.log("Product.find result=>", result);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log("product result=>", result);
      res.status(201).json({
        message: "Product added successfully!",
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log("product error=>", err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((result) => {
      console.log("find product result=>", result);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Product not found!" });
      }
    })
    .catch((err) => {
      console.log("find product err=>", err);
      res.status(500).json({ error: err });
    });
});

router.patch("/", (req, res, next) => {
  res.status(200).json({
    message: "Updated product",
  });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log("Product.remove result=>", result);
      res
        .status(200)
        .json({ message: "Product deleted successfully", response: result });
    })
    .catch((err) => {
      console.log("Product.remove error=>", err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
