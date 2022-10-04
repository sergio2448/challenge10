const loggerMiddleware = (req, res, next) => {
  const method = req.method;
  const url = req.url;
  let date = new Date();
  let timeStamp =
    "D: " +
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " / " +
    "T: " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
  console.log(`[${method}] => ${url}`, timeStamp);
  next();
};

module.exports = loggerMiddleware;
