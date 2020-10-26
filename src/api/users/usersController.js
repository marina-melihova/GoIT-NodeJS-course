const Joi = require('joi');
const UserModel = require('./usersModel');

const getCurrentUser = (req, res) => {
  const { email, id, subscription, token } = req.user;
  res.json({
    id,
    email,
    subscription,
    token,
  });
};

const updateSubscription = async (req, res, next) => {
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

module.exports = { getCurrentUser, updateSubscription, subscrSchema };
