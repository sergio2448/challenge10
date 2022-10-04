const express = require("express");
const productsRoutes = require("./products/products.routers");

const router = express.Router();
router.use("/products", productsRoutes);

module.exports = router;
