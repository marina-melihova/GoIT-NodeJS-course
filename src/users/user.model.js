const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: String,
    password: String,
    subscription: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    token: String,
  },
  { versionKey: false },
);

// collection => users
exports.UserModel = mongoose.model('User', userSchema);
