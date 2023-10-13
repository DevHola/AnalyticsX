const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Userschema = new Schema({
  Email: {
    type: String,
    required: true,
    unique: true

  },
  Username: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: String,
    required: true

  }
}, { timestamps: true })
module.exports = mongoose.model('users', Userschema)
