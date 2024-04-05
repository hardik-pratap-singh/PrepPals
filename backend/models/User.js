const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  level: { type: String, required: true },
  points: [{ type: String}],
//   skills: [{ type: String }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
