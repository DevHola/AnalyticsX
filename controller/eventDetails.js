const Eventdetail = require('../models/eventdetails')
const Event = require('../models/event')
const NewTevent = async (req, res, next) => {
  const findevent = await Event.findOne({ Tc: req.body.Tc })
  if (findevent) {
    try {
      const newevententry = await Eventdetail({
        eventId: findevent._id,
        additionalInfo: req.body.additionalInfo,
        Type: req.body.type,
        userAgent: req.body.userAgent,
        ipAddress: req.body.ipAddress

      })
      await newevententry.save()
      findevent.eventDetails.push(newevententry._id)
      await findevent.save()
      res.status(200).json({
        message: 'pinged!!'
      })
    } catch (error) {
      next(error)
    }
  }
}

const allEventTracking = async (req, res, next) => {
  const findevent = await Event.findOne({ Tc: req.params.id })
  if (findevent) {
    try {
      const alltrackingdata = await Eventdetail.find({ eventId: findevent._id })
      res.status(200).json(
        alltrackingdata
      )
    } catch (error) {
      next(error)
    }
  }
}
module.exports = {
  NewTevent, allEventTracking
}
// TODO: now work on the tracking module to implement the user interaction.
// TODO:test the user module
