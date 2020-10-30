const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
});

contactSchema.plugin(mongoosePaginate);

class ContactModel {
  constructor() {
    // collection name => contacts
    this.db = mongoose.model('Contact', contactSchema);
  }

  async getContacts(sub, pagination = false, page = 1, limit = 10) {
    let query = {};
    if (sub) {
      query = { subscription: sub };
    }
    const { docs } = await this.db.paginate(query, { page, limit, pagination });
    return docs;
  }

  async getContactById(id) {
    return await this.db.findById(id);
  }

  async addContact(contact) {
    return await this.db.create(contact);
  }

  async updateContact(id, contact) {
    return await this.db.findByIdAndUpdate(id, contact, {
      new: true,
    });
  }

  async deleteContact(id) {
    return await this.db.findByIdAndRemove(id);
  }
}

module.exports = new ContactModel();
