const mongoose = require('mongoose')

const connection = () => {
  mongoose.connect('mongodb://adminUser:adminPassword@mongodb:27017/?authMechanism=DEFAULT&authSource=ana', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
    authSource: 'admin'
    // mongodb://adminUser:adminPassword@localhost:27017/?authMechanism=DEFAULT&authSource=admin
  }).then(() => {
    console.log('Connection Established')
  }).catch((error) => {
    console.log(error)
  })
}
module.exports = connection
