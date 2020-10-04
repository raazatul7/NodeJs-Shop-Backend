const express = require("express");
const app = express();
const morganLogger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");
const usersRoutes = require("./api/routes/users");

//connectors
app.use(morganLogger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose.connect(
  "mongodb+srv://raazatul7:" +
    process.env.MONGO_ATLAS_PASS +
    "@cluster0.ra0fa.mongodb.net/" +
    process.env.MONGO_ATLAS_USER +
    "?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

//Routes
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/users", usersRoutes);

//Images route
app.use("/uploads/", express.static("uploads"));

//Header
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
    return res.status(200).json({});
  }
});

//error handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
