const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../users/usersModel');
const Joi = require('joi');
const uuid = require("uuid");
const AppError = require('../../helpers/appError');
const { generateAvatar, handleAvatar } = require('../../helpers/uploadAvatar');

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

  const randomAvatar = await generateAvatar();
  await handleAvatar(randomAvatar);
  const avatarURL = `http://localhost:3000/images/${randomAvatar}`;
  const verificationToken = uuid.v4(),
  const newUser = await UserModel.addUser({ email, passwordHash, verificationToken, avatarURL });

  await sendVerificationEmail(email, verificationToken);

  const { _id, subscription } = newUser;
  return res.status(201).json({ _id, email, subscription, avatarURL });
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
  return res.sendStatus(204);
};

const signSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `http://localhost:3000/api/v1/auth/verify/${verificationToken}`;
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: 'Confirm your registration on Contacts-app',
    text: 'Welcome to Contacts-application!',
    html: `<a href=${verificationLink} target="_blank">Click here to verify your email</a>`,
  };
  await sgMail.send(msg);
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
}

module.exports = { signIn, signUp, logout, verifyEmail, signSchema };
