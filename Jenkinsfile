pipeline {
  agent {
    docker {
      image 'docker:24.0.6'
      args '-v /var/run/docker.sock:/var/run/docker.sock'
    }

  }
  stages {
    stage('Checkout code') {
      steps {
        git(url: 'https://github.com/DevHola/AnalyticsX', branch: 'main')
      }
    }

    stage('Run Docker compose') {
      steps {
        sh 'docker compose -f docker-compose.yaml up -d'
      }
    }

  }
  post {
    always {
      sh 'docker-compose -f docker-compose.yaml down'
    }

  }
}