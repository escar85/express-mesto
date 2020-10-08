const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  avatar: {
    type: String,
    required: true,
    validate: {
       validator(v) {
       return validator.isURL(v)
      }
    }
  }
})

module.exports = mongoose.model('user', userSchema);