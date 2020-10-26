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

class UserModel {
  constructor() {
    // collection name => users
    this.db = mongoose.model('User', userSchema);
  }

  async getUsers() {
    return await this.db.find();
  }

  async getUserById(id) {
    return await this.db.findById(id);
  }

  async getUserByEmail(email) {
    return await this.db.findOne({ email });
  }

  async addUser(user) {
    return await this.db.create(user);
  }

  async updateUser(id, props) {
    return await this.db.findByIdAndUpdate(id, props, {
      new: true,
    });
  }

  async updateToken(id, token) {
    return await this.db.findByIdAndUpdate(id, {
      token,
    });
  }

  async updateSubscr(id, subscription) {
    return await this.db.findByIdAndUpdate(id, {
      subscription,
    });
  }

  async updateAvatar(id, avatarUrl) {
    return await this.db.findByIdAndUpdate(id, {
      avatarUrl,
    });
  }

  async deleteUser(id) {
    return await this.db.findByIdAndRemove(id);
  }
}

module.exports = new UserModel();
