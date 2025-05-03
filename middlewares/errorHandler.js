
const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.status || 400;
  const message = err.message || "An unexpected error occurred.";

  res.status(statusCode).json({ message });
  next();
};

module.exports = errorHandler;