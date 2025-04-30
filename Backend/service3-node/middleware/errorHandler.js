function errorHandler(err, req, res, next) {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: err.message,
      });
    }
  
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        error: 'Invalid Token',
        details: err.message,
      });
    }
  
    res.status(500).json({
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
  
  module.exports = errorHandler;