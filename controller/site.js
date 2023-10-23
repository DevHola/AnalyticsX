const SiteModel = require('../models/site')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const siteadd = async (req, res, next) => {
  if (req.body.sitename !== '' && req.body.siteurl !== '') {
    try {
      const code = await crypto.randomBytes(50).toString('hex')
      const Key = await crypto.randomBytes(50).toString('hex')
      const site = await SiteModel({
        Owner: req.user.data._id,
        Site_Name: req.body.sitename,
        Site_Url: req.body.siteurl,
        Tracking_Code: code,
        Verified: false,
        Apikey: Key
      })
      await site.save()
      res.status(200).json({
        message: 'Site added'
      })
    } catch (error) {
      next(error)
    }
  }
}
const site = async (req, res, next) => {
  try {
    const site = await SiteModel.findOne({ Site_Name: req.params.id })
    if (!site) {
      res.status(200).json({ message: 'Site does not exist' })
    }
    res.status(200).json({
      data: site
    })
  } catch (error) {
    next(error)
  }
}
const regenerateTC = async (req, res, next) => {
  try {
    const code = await crypto.randomBytes(50).toString('hex')
    const site = await SiteModel.findOneAndUpdate({ Site_Name: req.params.id }, { Tracking_Code: code }, { new: true })
    if (site) {
      res.status(200).json({
        message: 'tracking code updated'
      })
    }
  } catch (error) {
    next(error)
  }
}
const usersites = async (req, res, next) => {
  try {
    const sites = await SiteModel.find({ Owner: req.user.data._id })
    res.status(200).json({
      data: sites
    })
  } catch (error) {
    next(error)
  }
}
const allsites = async (req, res, next) => {
  try {
    const allsites = await SiteModel.find()
    res.status(200).json({
      data: allsites
    })
  } catch (error) {
    next(error)
  }
}
const verificationkeyfile = async (req, res, next) => {
  const apikey = req.params.id
  try {
    const verificationcontent = `<!-- verification-file.html -->
    <html>
    <head>
        <meta name="api-key" content="${apikey}">
    </head>
    <body>
        Verification file 
    </body>
    </html>`

    const verificationfilepath = path.join(__dirname, 'verification-file.html')
    fs.writeFile(verificationfilepath, verificationcontent, (err) => {
      if (err) {
        res.status(500).json({
          message: `error creating file ${err}`
        })
      } else {
        res.setHeader('Content-Type', 'text/html')
        res.setHeader('Content-Disposition', 'attachment; filename=verification-file.html')
        res.status(200).sendFile(verificationfilepath)
      }
    })
  } catch (error) {
    next(error)
  }
}

// site ownership verification
const ownerverification = async (req, res, next) => {
  const url = req.query.url
  console.log(url)
  const verificationurl = `${url}/verification-file.html`
  try {
    const response = await axios.get(verificationurl)
    const filecontent = response.data
    // Extract the API key from the verification file content
    const apikeyMatch = filecontent.match(/<meta name="api-key" content="(.*?)">/)
    const extractedApiKey = apikeyMatch ? apikeyMatch[1] : null
    const site = await SiteModel.findOne({ Site_Url: url })
    if (site.Apikey === extractedApiKey) {
      await SiteModel.findOneAndUpdate({ Site_Url: url }, { Verified: true }, { new: true })
      res.status(200).json({
        message: 'Verification Successful'
      })
    } else {
      res.status(200).json({
        message: 'Verification Failed'
      })
    }
  } catch (error) {
    next(error)
  }
}
module.exports = {
  siteadd, site, regenerateTC, usersites, allsites, ownerverification, verificationkeyfile
}
