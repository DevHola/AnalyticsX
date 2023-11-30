const mongoose = require('mongoose')

const connection = () => {
  mongoose.connect(process.env.mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
    authSource: 'admin',
    directConnection: true
    // mongodb://adminUser:adminPassword@localhost:27017/?authMechanism=DEFAULT&authSource=ana
  }).then(() => {
    console.log('Connection Established')
  }).catch((error) => {
    console.log(error)
  })
}
module.exports = connection
/* docker run --name jenkins-docker --rm --detach ^
  --privileged --network jenkins --network-alias docker ^
  --env DOCKER_TLS_CERTDIR=/certs ^
  --volume jenkins-docker-certs:/certs/client ^
  --volume jenkins-data:/var/jenkins_home ^
  --publish 2376:2376 ^
  docker:dind --storage-driver overlay2
*/
