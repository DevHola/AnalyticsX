const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config()
const db = require('./utils/db')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('combined'))

const routes = require('./routes/routes')
app.use('/api', routes)
app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).json({
    message: 'Something went wrong'
  })
})
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Analytics Engine v1.0 ${PORT}`)
  db()
})
