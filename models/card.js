const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g.test(v)
      }
    }
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  likes: [{
    default: [],
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('card', cardSchema);