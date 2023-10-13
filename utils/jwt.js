const jwt = require('jsonwebtoken')

const verify = (req, res, next) => {
  const token = req.body.token || req.headers.authorization || req.headers['auth-access-token']
  if (!token) {
    res.status(401).json({
      message: 'Missing Authorization header'
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.KEY)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid Token' })
  }
}

module.exports = {
  verify
}
