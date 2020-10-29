class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.statusName = `${status}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
