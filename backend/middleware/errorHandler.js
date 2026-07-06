// Catches any error thrown or passed to next() in routes/controllers
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong on the server',
    // only show stack trace in development, never in production
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;