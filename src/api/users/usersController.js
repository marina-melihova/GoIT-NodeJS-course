const Joi = require('joi');
const UserModel = require('./usersModel');
const { handleAvatar } = require('../../helpers/uploadAvatar');

const getCurrentUser = (req, res) => {
  const { email, _id, avatarURL, subscription, token } = req.user;
  return res.json({ _id, email, avatarURL, subscription, token });
};

const updateAvatar = async (req, res) => {
  const { user, file } = req;
  if (file.mimetype.includes('image')) {
    const avatarFilename = file.filename;
    await handleAvatar(avatarFilename);
    const newAvatarUrl = `http://localhost:3000/images/${avatarFilename}`;

    await UserModel.updateAvatar(user._id, newAvatarUrl);
    user.avatarURL = newAvatarUrl;
    const { _id, email, avatarURL, subscription, token } = user;
    return res.json({ _id, email, avatarURL, subscription, token });
  }
  return res.status(400).json({ message: 'Please, send a valid image.' });
};

const updateSubscription = async (req, res) => {
  const { email, _id, avatarURL, token } = req.user;
  const { subscription } = req.body;

  await UserModel.updateSubscr(_id, subscription);
  req.user.subscription = subscription;
  return res.json({ _id, email, avatarURL, subscription, token });
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
