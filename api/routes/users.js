const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email alreay exist.",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if (error) {
            return res.status(500).json(error);
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "Signed Up successfully!",
                  userCreated: result,
                });
              })
              .catch((error) => {
                res.status(500).json(error);
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth fail.",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (error, match) => {
        if (error) {
          return res.status(401).json({
            message: "Auth fail pass.",
          });
        }
        if (match) {
          const token = jwt.sign(
            { email: user[0].email, id: user[0]._id },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Logged in successfully.",
            token,
          });
        }
        res.status(401).json({
          message: "Auth fail.",
        });
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;
