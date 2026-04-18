const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ngo', 'admin'], default: 'ngo' },
  status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
});

module.exports = mongoose.model('User', userSchema);
