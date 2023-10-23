pipeline {
  agent {
  docker {
    image 'docker:dind'
    args '-it --user root --privileged --name stable-dind -v /var/run/docker.sock:/var/run/docker.sock'
  }
}
  tools {nodejs "NodeJS"}
  stages {
    stage('Checkout code') {
      steps {
        git(url: 'https://github.com/DevHola/AnalyticsX', branch: 'Development')
      }
    }
    
    stage('Run Dockerized Application') {
      steps {
        sh 'docker compose -f docker-compose.yaml up -d'
      }
    }
}
  post {
    always {
      sh 'docker compose -f docker-compose.yaml down'
    }
  }
}
