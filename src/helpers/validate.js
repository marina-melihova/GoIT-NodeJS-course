const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

const validate = (schema, reqPart = 'body') => (req, res, next) => {
  const { value, error } = schema.validate(req[reqPart], options);

  if (error) {
    return next(error);
  }

  req[reqPart] = value;
  return next();
};

module.exports = { validate };
