const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PagedetailSchema = new Schema({
  Pageview: {
    type: Schema.Types.ObjectId,
    required: true

  },
  sessionid: {
    type: String,
    required: true

  },
  page: {
    type: String,
    required: true

  },
  sessionduration: {
    type: Number,
    default: null

  },
  timeOnpage: {
    type: Number,
    default: null

  }
})
module.exports = mongoose.model('pagedetails', PagedetailSchema)
