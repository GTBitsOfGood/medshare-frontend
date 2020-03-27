const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BCRYPT_SALT_ROUNDS = 12;

const User = new mongoose.Schema({
  username: String,
  password: String
});

User.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
};
User.methods.setPassword = function(password) {
  const hashedPassword = bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
  this.password = hashedPassword;
};

module.exports = mongoose.model('User', User);
