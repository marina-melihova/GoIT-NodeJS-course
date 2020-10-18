const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

const validate = function (schema, reqPart = 'body') {
  return (req, res, next) => {
    const validationResult = schema.validate(req[reqPart], options);

    if (validationResult.error) {
      error.status = 400;

      error.message = `Validation error: ${error.details
        .map(item => item.message)
        .join(', ')}`;

      return res.status(400).json(validationResult.error);
    }
    req[reqPart] = validationResult.value;
    next();
  };
};

module.exports = { validate };
