const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

const validate = (schema, reqPart = 'body') => (req, res, next) => {
  const validationResult = schema.validate(req[reqPart], options);

  if (validationResult.error) {
    const errMsg = `Validation error: ${validationResult.error.details
      .map(item => item.message)
      .join(', ')}`;

    return res.status(400).json({ message: errMsg });
  }
  req[reqPart] = validationResult.value;
  next();
};

module.exports = { validate };
