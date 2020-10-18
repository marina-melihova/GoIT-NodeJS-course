const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactsSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
});

// collection name => contacts
const ContactModel = mongoose.model('Contact', contactsSchema);
module.exports = { ContactModel };
