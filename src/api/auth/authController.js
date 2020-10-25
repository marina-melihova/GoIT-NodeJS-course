const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../users/usersModel');
const Joi = require('joi');
const AppError = require('../../helpers/appError');

const signSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const signUp = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await UserModel.getUserByEmail(email);
  if (existingUser) {
    return next(new AppError('User with such email already exists', 409)); // new Conflict();
  }

  const passwordHash = await bcryptjs.hash(
    password,
    parseInt(process.env.SALT_ROUNDS),
  );

  const newUser = await UserModel.addUser({
    email,
    password,
  });

  res.status(201).json({
    id: newUser._id,
    email: newUser.email,
  });
};

const signIn = async (req, res, next) => {
  // 1. validate req body +
  // 2. find user with provided email +
  // 3. if not found - throw 404 +
  // 4. compare password with existing hash +
  // 5. if password is wrong - throw 403 +
  // 6. generate auth token +
  // 7. send successful response +
  try {
    const { email, password } = req.body;

    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return next(new AppError('User with such email not found', 404)); // new NotFound();
    }

    const isCorrectPassword = await bcryptjs.compare(
      password,
      user.passwordHash,
    );
    if (!isCorrectPassword) {
      return next(new AppError('Provided password is wrong', 403)); // new Forbidden();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // res.cookie('token', token, { httpOnly: true });
    // Set-Cookie: token=<value>;httpOnly

    await UserModel.updateToken(user._id, token);

    return res.json({
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  await UserModel.updateToken(req.user._id, null);
  res.sendStatus(204);
};

module.exports = { signIn, signUp, logout, signSchema };
