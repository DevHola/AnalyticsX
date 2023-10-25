const Event = require('../models/event')
const crypto = require('crypto')
const newEvent = async (req, res, next) => {
  try {
    const code = await crypto.randomBytes(50).toString('hex')
    const createEvent = await Event({
      siteId: req.body.siteId,
      eventName: req.body.eventName,
      eventType: req.body.eventType,
      Tc: code
    })
    await createEvent.save()
    res.status(200).json({
      message: 'Trackable Event Created'
    })
  } catch (error) {
    next(error)
  }
}

const allSiteEvent = async (req, res, next) => {
  try {
    const events = await Event.find({ siteId: req.params.id })
    if (events) {
      res.status(200).json({
        events
      })
    }
  } catch (error) {
    next(error)
  }
}

const singleEvent = async (req, res, next) => {
  try {
    const event = await Event.findOne({ _id: req.params.id }).populate('eventDetails').exec()
    if (event) {
      res.status(200).json(
        event
      )
    }
  } catch (error) {
    next(error)
  }
}

const eventNameChange = async (req, res, next) => {
  try {
    const update = await Event.findByIdAndUpdate(req.body.id, { $set: { eventName: req.body.name } }, { new: true })
    if (update) {
      res.status(200).json({
        message: 'Event Name Updated'
      })
    }
  } catch (error) {
    next(error)
  }
}
module.exports = {
  newEvent, allSiteEvent, singleEvent, eventNameChange
}
