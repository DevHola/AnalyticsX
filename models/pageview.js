const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PageviewSchema = new Schema({
  siteId: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    required: true
  },
  screenWidth: {
    type: Number,
    required: true
  },
  screenHeight: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  browser: {
    name: String,
    version: String,
    platform: String
  },
  sessionId: {
    type: String,
    required: true
  },
  trafficSource: {
    type: String,
    required: true
  },
  sessionStartTime: {
    type: Date,
    required: true
  },
  sessionDuration: {
    type: Number,
    required: true,
    default: 0
  },
  pagesdetails: [{
    type: Schema.Types.ObjectId,
    ref: 'pagedetails'
  }],
  timeOnPage: {
    type: Number,
    required: true,
    default: 0
  },
  deviceType: {
    type: String,
    required: true
  },
  operatingSystem: {
    type: String,
    required: true
  }
}, { timestamps: true })
module.exports = mongoose.model('Pageview', PageviewSchema)
