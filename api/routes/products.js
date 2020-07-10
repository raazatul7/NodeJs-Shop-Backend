const express = require("express");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const ProductController = require("../controller/products");
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

router.get("/", ProductController.products_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductController.products_post
);

router.get("/:productId", ProductController.products_get_one);

router.patch("/:productId", checkAuth, ProductController.product_update);

router.delete("/:productId", checkAuth, ProductController.product_delete);

module.exports = router;
