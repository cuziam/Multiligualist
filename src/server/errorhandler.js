const errorController = function (error, req, res, next) {
  console.error(error);
  res.status(500).send("Internal server error... Sorry we'll fix it soon!");
};

module.exports = { errorController };
