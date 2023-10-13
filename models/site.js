const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Siteschema = new Schema({
  Owner: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  Site_Name: {
    type: String,
    required: true,
    unique: true
  },
  Site_Url: {
    type: String,
    required: true,
    unique: true
  },
  Tracking_Code: {
    type: String,
    required: true,
    unique: true
  },
  Verified: {
    type: Boolean,
    default: false,
    required: true
  },
  Apikey: {
    type: String,
    required: true
  }

}, { timestamps: true })
module.exports = mongoose.model('site', Siteschema)
