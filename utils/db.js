const mongoose = require('mongoose')

const connection = () => {
  mongoose.connect(process.env.mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // family: 4,
    // useCreateIndex: true,
    // useFindAndModify: false
    // mongodb://adminUser:adminPassword@localhost:27017/?directConnection=true&authSource=admin&replicaSet=replicaset&retryWrites=true
  }).then(() => {
    console.log('Connection Established')
  }).catch((error) => {
    console.log(error)
  })
}
module.exports = connection
