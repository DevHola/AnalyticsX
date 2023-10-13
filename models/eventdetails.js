const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventDetail = new Schema({
  eventId: {
    type: mongoose.Types.ObjectId,
    ref: 'events'
  },

  additionalInfo: {
    type: mongoose.Schema.Types.Mixed
  },

  Type: [{
    type: String,
    required: true,
    enum: ['form-submittion', 'button-click', 'link-click', 'nav-menu', 'video-p-p', 'file-dwonload', 'search', 'social-share']
  }],

  userAgent: mongoose.Schema.Types.Mixed,
  ipAddress: String
}, { timestamps: true })
module.exports = mongoose.model('eventDetail', eventDetail)
