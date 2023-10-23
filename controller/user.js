const Usermodel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const register = async (req, res, next) => {
  if (req.body.email !== '' && req.body.password !== '' && req.body.username !== '') {
    try {
      const User = await Usermodel.findOne({ Email: req.body.email })
      if (User) {
        res.status(200).json({
          message: 'User Already Exist'
        })
      }
      const hash = await bcrypt.hashSync(req.body.password, 10)
      const newuser = await Usermodel({
        Email: req.body.email,
        Username: req.body.username,
        Password: hash
      })
      await newuser.save().then(() => {
        res.status(200).json({
          message: 'registered'
        })
      })
    } catch (error) {
      next(error)
    }
  }
}

const login = async (req, res, next) => {
  if (req.body.email !== '' && req.body.password !== '') {
    try {
      const user = await Usermodel.findOne({ Email: req.body.email })
      if (!user) {
        res.status(200).json({
          message: 'User Does Not Exist'
        })
      }
      const compare = bcrypt.compareSync(req.body.password, user.Password)
      if (compare) {
        const data = {
          email: user.Email,
          username: user.Username,
          Registered: true
        }
        const token = jwt.sign({ data }, process.env.KEY, { expiresIn: 60 * 60 })
        res.status(200).json({
          Message: 'Success',
          data: token
        })
      }
    } catch (error) {
      next(error)
    }
  }
}

const logout = async (req, res, next) => {

}

const user = async (req, res, next) => {
  try {
    const user = await Usermodel.findOne({ Email: req.user.data.email }).select('-Password').exec()
    if (!user) {
      res.status(200).json({ message: 'Invalid User' })
    }
    res.status(200).json({
      User: user
    })
  } catch (error) {
    next(error)
  }
}
module.exports = {
  register, login, logout, user
}
