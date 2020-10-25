const jwt = require('jsonwebtoken');
const UserModel = require('../api/users/usersModel');
const AppError = require('./appError');

const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace('Bearer ', '');
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.getUserById(payload.userId);
    if (!user) {
      return next(new AppError('Not authorized', 401)); // new Unauthorized();
    }

    req.user = user;
    next();
  } catch (err) {
    next(new AppError('Token is not valid', 401)); // new Unauthorized();
  }
};

module.exports = { authorize };
