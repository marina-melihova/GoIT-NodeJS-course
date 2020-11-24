const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../users/usersModel');
const Joi = require('joi');
const uuid = require('uuid');
const { uploadFile, AppError, mailService } = require('../../services');

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

  const randomAvatar = await uploadFile.generateAvatar();
  await uploadFile.handleAvatar(randomAvatar);
  const avatarURL = `http://localhost:3000/images/${randomAvatar}`;
  const verificationToken = uuid.v4();
  const newUser = await UserModel.addUser({
    email,
    passwordHash,
    verificationToken,
    avatarURL,
  });

  await mailService.sendVerificationEmail(email, verificationToken);

  const { _id, subscription } = newUser;
  return res.status(201).json({ _id, email, subscription, avatarURL });
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.getUserByEmail(email);
  if (!user) {
    return next(new AppError('Not authorized', 401));
  }
  if (user.verificationToken) {
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
  return res.sendStatus(204);
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await UserModel.findOneAndUpdate(
    { verificationToken },
    { $unset: { verificationToken } },
    { new: true },
  );
  if (!user) {
    return next(new AppError('Not found', 404));
  }
  return res.json('User successfully verified');
};

const signSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

module.exports = { signIn, signUp, logout, verifyEmail, signSchema };
