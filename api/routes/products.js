const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const Product = require("../models/product");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (res, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (res, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 2,
  },
  fileFilter: fileFilter,
});

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((result) => {
      const response = {
        message: "Product found successfully!",
        count: result.length,
        products: result.map((result) => {
          return {
            name: result.name,
            price: result.price,
            productImage: result.productImage,
            _id: result._id,
            response: {
              type: "GET",
              url: "http://localhost:9000/products/" + result._id,
            },
          };
        }),
      };
      if (result.length > 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No Product found!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log("res.file=>", req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Product added successfully!",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          response: {
            type: "POST",
            url: "http://localhost:9000/products/" + result._id,
          },
        },
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Product not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Updated sucessfully!",
        result,
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res
        .status(200)
        .json({ message: "Product deleted successfully", response: result });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;
