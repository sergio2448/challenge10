const moment = require("moment");
const formatMessage = (id, username, text) => {
  return {
    id,
    username,
    text,
    time: moment().format("h:mm a"),
  };
};

const allProducts = async (productApi) => {
  const getProducts = await productApi.getAll();
  const products =
    getProducts.length > -1 && getProducts.length < 4
      ? false
      : JSON.parse(getProducts);
  console.log("[PRODUCTS]", products);
  return products;
};

module.exports = {
  formatMessage,
  allProducts,
};
