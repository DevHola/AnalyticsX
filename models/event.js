const mongoose = require('mongoose')
const Schema = mongoose.Schema
const eventSchema = new Schema({
  siteId: {
    type: mongoose.Types.ObjectId,
    ref: 'site'
  },
  eventName: {
    type: String,
    required: true,
    unique: true
  },
  Tc: {
    type: String,
    required: true,
    unique: true
  },
  eventType: [{
    type: String,
    required: true,
    enum: ['form-submittion', 'button-click', 'link-click', 'nav-menu', 'video-p-p', 'file-dwonload', 'search', 'social-share']
  }],
  eventDetails: [{
    type: mongoose.Types.ObjectId,
    ref: 'eventDetail'
    // type: mongoose.Schema.Types.Mixed
  }] // Object to store event-specific data

}, { timestamps: true })
module.exports = mongoose.model('events', eventSchema)
