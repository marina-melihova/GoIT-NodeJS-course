const { usersRouter } = require('./usersRouter');

const getCurrentUser = (req, res, next) => {
  return res.status(200).send({
    id: req.user._id,
    email: req.user.email,
  });
};

module.exports = { getCurrentUser };
