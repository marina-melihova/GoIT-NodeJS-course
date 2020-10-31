const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatarURL: String,
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: { type: String, default: '' },
});

userSchema.statics.getUserById = getUserById;
userSchema.statics.getUsers = getUsers;
userSchema.statics.addUser = addUser;
userSchema.statics.updateUser = updateUser;
userSchema.statics.deleteUser = deleteUser;
userSchema.statics.getUserByEmail = getUserByEmail;
userSchema.statics.updateToken = updateToken;
userSchema.statics.updateSubscr = updateSubscr;
userSchema.statics.updateAvatar = updateAvatar;

async function getUsers() {
  return await this.find();
}

async function getUserById(id) {
  return await this.findById(id);
}

async function addUser(user) {
  return await this.create(user);
}

async function updateUser(userId, updateParams) {
  return await this.findByIdAndUpdate(userId, updateParams, { new: true });
}

async function deleteUser(id) {
  return await this.deleteOne({ _id: id });
}

async function getUserByEmail(email) {
  return await this.findOne({ email });
}

async function updateToken(id, token) {
  return await this.findByIdAndUpdate(id, { token });
}

async function updateSubscr(id, subscription) {
  return await this.findByIdAndUpdate(id, {
    subscription,
  });
}

async function updateAvatar(id, avatarURL) {
  return this.findByIdAndUpdate(id, {
    avatarURL,
  });
}

module.exports = mongoose.model('User', userSchema);
