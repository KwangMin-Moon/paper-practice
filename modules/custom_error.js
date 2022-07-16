module.exports = function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  error.success = false;

  return error;
};
