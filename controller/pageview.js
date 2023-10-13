const PageViewModel = require('../models/pageview')

const Track = async (req, res) => {
  console.log(req.body)
  try {
    const Payview = await PageViewModel({
      siteId: req.body.siteId,
      userAgent: req.body.userAgent,
      referrer: req.body.referrer,
      screenWidth: req.body.screenWidth,
      screenHeight: req.body.screenHeight,
      language: req.body.language,
      browser: {
        name: req.body.browser.name,
        version: req.body.browser.version,
        platform: req.body.browser.platform
      },
      sessionId: req.body.sessionId,
      trafficSource: req.body.trafficSource,
      sessionStartTime: req.body.sessionStartTime,
      deviceType: req.body.deviceType,
      operatingSystem: req.body.operatingSystem
    })
    console.log(Payview)
    await Payview.save()
    res.status(200).json({
      message: 'Pinged',
      data: Payview
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error Occured',
      error: error.message
    })
  }
}

const wipv = async (req, res) => {
  const Pageview = await PageViewModel.find({ siteId: req.params.id })
  if (Pageview) {
    res.status(200).json({
      message: 'Data Grabbed',
      Data: Pageview
    })
  }
}

const pvvsid = async (req, res) => {
  const Pageview = await PageViewModel.findOne({ sessionId: req.params.id })
  if (Pageview) {
    res.status(200).json({
      message: 'Data Grabbed',
      data: Pageview
    })
  }
}

const cvsid = async (req, res) => {
  const Pageview = await PageViewModel.findOne({ sessionId: req.params.id })
  if (Pageview) {
    res.status(200).json({
      message: 'Exist'
    })
  } else {
    res.status(200).json({
      message: 'No-Exist'
    })
  }
}
module.exports = {
  Track, wipv, pvvsid, cvsid
}
