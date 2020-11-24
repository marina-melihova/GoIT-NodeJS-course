const jwt = require('jsonwebtoken');
const UserModel = require('../api/users/usersModel');
const AppError = require('./appError');

const authorize = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError('Not authorized', 401));
  }
  const token = authHeader.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new AppError('Not authorized', 401));
  }
  const user = await UserModel.getUserById(payload.userId);
  if (!user) {
    return next(new AppError('Not authorized', 401));
  }
  if (!user.token) {
    return next(new AppError('Not authorized', 401));
  }
  req.user = user;
  return next();
};

module.exports = authorize;
