const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: String,
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
    try {
      const result = await this.db.create(user);
      console.log('result', result);
      return result;
    } catch (error) {
      console.log('error in model', error);
    }
  }

  async updateUser(id, props) {
    return await this.db.findByIdAndUpdate(id, props, {
      new: true,
    });
  }

  async updateToken(id, newToken) {
    return await this.db.findByIdAndUpdate(id, {
      token: newToken,
    });
  }

  async deleteUser(id) {
    return await this.db.findByIdAndRemove(id);
  }
}

module.exports = new UserModel();