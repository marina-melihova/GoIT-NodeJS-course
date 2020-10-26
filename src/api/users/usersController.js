const path = require('path');
const Joi = require('joi');
const UserModel = require('./usersModel');
const { handleAvatar } = require('../../helpers/uploadAvatar');

const getCurrentUser = (req, res) => {
  const { email, id, avatarUrl, subscription, token } = req.user;
  res.json({
    id,
    email,
    avatarUrl,
    subscription,
    token,
  });
};

const updateAvatar = async (req, res) => {
  const { user, file } = req;
  if (file.mimetype.includes('image')) {
    console.log('file', file.filename);
    const avatarFilename = file.filename;
    await handleAvatar(avatarFilename);
    const newAvatarUrl = `http://localhost:3000/images/${avatarFilename}`;
    await UserModel.updateAvatar(user.id, newAvatarUrl);
    user.avatarUrl = newAvatarUrl;
    return res.json({ newAvatarUrl });
  }
  res.status(400).json({ message: 'Please, send a valid image.' });
};

const updateSubscription = async (req, res) => {
  const { email, id, token } = req.user;
  const { subscription } = req.body;

  await UserModel.updateSubscr(id, subscription);
  req.user.subscription = subscription;
  res.json({
    id,
    email,
    subscription,
    token,
  });
};

const subscrSchema = Joi.object({
  subscription: Joi.string().required().valid('free', 'pro', 'premium'),
});

module.exports = {
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  subscrSchema,
};
