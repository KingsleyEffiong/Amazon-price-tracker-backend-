const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || "Server Error";
  error.statusCode = err.statusCode || 500;

  console.error("Error:", error);

  if (err.name === "CastError") {
    error.message = "Resource not found";
    error.statusCode = 404;
  }

  if (err.code === 11000) {
    error.message = "Duplicate field value entered";
    error.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error.statusCode = 400;
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
  });
};

export default errorMiddleware;
