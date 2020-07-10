const mongoose = require("mongoose");
const Product = require("../models/product");

exports.products_get_all = (req, res, next) => {
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
};

exports.products_post = (req, res, next) => {
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
};

exports.products_get_one = (req, res, next) => {
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
};

exports.product_update = (req, res, next) => {
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
};

exports.product_delete = (req, res, next) => {
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
};
