const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
    email: {
    type: String,
    unique: true,
  },
    password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user',
  },
  refreshToken: {
    type: String,
  },
}, { timestamps: true });   

module.exports = mongoose.model('User', userSchema);