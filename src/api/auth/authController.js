const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../users/usersModel');
const Joi = require('joi');
const AppError = require('../../helpers/appError');

const signUp = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await UserModel.getUserByEmail(email);
  if (existingUser) {
    return next(new AppError('User with such email already exists', 409));
  }

  const passwordHash = await bcryptjs.hash(
    password,
    parseInt(process.env.SALT_ROUNDS),
  );

  const newUser = await UserModel.addUser({ email, passwordHash });
  const { id, subscription } = newUser;
  res.status(201).json({
    id,
    email,
    subscription,
  });
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.getUserByEmail(email);
  if (!user) {
    return next(new AppError('Not authorized', 401));
  }

  const isCorrectPassword = await bcryptjs.compare(password, user.passwordHash);
  if (!isCorrectPassword) {
    return next(new AppError('Not authorized', 401));
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  await UserModel.updateToken(user._id, token);

  return res.json({
    user: {
      id: user._id,
      email: user.email,
    },
    token,
  });
};

const logout = async (req, res) => {
  await UserModel.updateToken(req.user._id, null);
  req.user = null;
  res.sendStatus(204);
};

const signSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

module.exports = { signIn, signUp, logout, signSchema };
