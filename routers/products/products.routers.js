const express = require("express");
const { products } = require("../../data/data.js");
// const loggerMiddleware = require('../../middlewares/logger.js');
const router = express.Router();

module.exports = router;

// Middlewares
// router.use(loggerMiddleware);

// Routes
// router.get('/', loggerMiddleware, (req, res) =>...
router.get("/", (req, res) => {
  const { maxPrice, search } = req.query;
  let productsResponse = [...products];
  if (Object.keys(req.query).length > 0) {
    if (maxPrice) {
      if (isNaN(+maxPrice)) {
        return res
          .status(400)
          .json({ success: false, error: "maxPrice must be a valid number" });
      }
      productsResponse = productsResponse.filter(
        (product) => product.price <= +maxPrice
      );
    }
    if (search) {
      productsResponse = productsResponse.filter((product) =>
        product.name.toLowerCase().startsWith(search.toLowerCase())
      );
    }
    return res.json({ success: true, result: productsResponse });
  }
  return res.json({ success: true, result: productsResponse });
});

router.get("/:productId", (req, res) => {
  const { productId } = req.params;
  const product = products.find((product) => product.id === +productId);
  if (!product) {
    return res
      .status(404)
      .json({
        success: false,
        error: `Product with id: ${productId} does not exist!`,
      });
  }
  return res.json({ success: true, result: product });
});

router.post("/", (req, res) => {
  const { title, price, thumbnail } = req.body;
  if (!title || !price || !thumbnail) {
    return res.status(400).json({ succes: false, error: "Wrong body format" });
  }
  const newProduct = {
    id: products.length + 1,
    title,
    price,
    thumbnail,
  };
  products.push(newProduct);
  return res.json({ success: true, result: newProduct });
});

router.put("/:productId", (req, res) => {
  const {
    params: { productId },
    body: { title, price, thumbnail },
  } = req;
  if (!title || !price || !thumbnail) {
    return res.status(400).json({ success: false, error: "Wrong body format" });
  }
  const productIndex = products.findIndex(
    (product) => product.id === +productId
  );
  if (productIndex < 0)
    return res
      .status(404)
      .json({
        success: false,
        error: `Product with id: ${productId} does not exist!`,
      });
  const newProduct = {
    ...products[productIndex],
    title,
    price,
    thumbnail,
  };
  products[productIndex] = newProduct;
  return res.json({ success: true, result: newProduct });
});

router.delete("/:productId", (req, res) => {
  const { productId } = req.params;
  const productIndex = products.findIndex(
    (product) => product.id === +productId
  );
  if (productIndex < 0)
    return res
      .status(404)
      .json({
        success: false,
        error: `Product with id ${productId} does not exist!`,
      });
  products.splice(productIndex, 1);
  return res.json({ success: true, result: "product correctly eliminated" });
});
