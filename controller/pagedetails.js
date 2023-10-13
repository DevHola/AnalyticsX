const Pagedetails = require('../models/pagedetails')
const Pageview = require('../models/pageview')
const createpage = async (req, res) => {
  const page = await Pagedetails({
    Pageview: req.body.pageview,
    sessionid: req.body.sessionid,
    page: req.body.page

  })
  await page.save()
  const pageview = await Pageview.findOne({ sessionId: page.sessionid })
  pageview.pagesdetails.push(page._id)
  await pageview.save()
  res.status(200).json({
    message: 'captured'
  })
}
const updatedetails = async (req, res) => {
  console.log(req.body)
  const decodedId = decodeURIComponent(req.body.page)
  const updatedata = await Pagedetails.findOneAndUpdate({ sessionId: req.body.sessionid, Pageview: req.body.pageview, page: decodedId }, {
    sessionduration: req.body.sessionpageduration,
    timeOnpage: req.body.timeOnPage
  }, { new: true })
  if (updatedata) {
    res.status(200).json({
      message: 'ping updated'
    })
  }
}
const checkPSP = async (req, res) => {
  const check = await Pagedetails.findOne({
    Pageview: req.params.id,
    sessionid: req.params.is,
    page: req.params.it
  })
  if (check) {
    res.status(200).json({
      message: 'Exist'
    })
  } else {
    res.status(200).json({
      message: 'Not-Exist'
    })
  }
}
module.exports = {
  createpage, updatedetails, checkPSP
}
