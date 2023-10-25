pipeline {
  agent any
  tools {nodejs "nodejs"}
  stages {
    stage('Checkout code') {
      steps {
        git(url: 'https://github.com/DevHola/AnalyticsX', branch: 'Development')
      }
    }
    stage('npm install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Run Dockerized Application') {
      steps {
        sh 'docker compose -f docker-compose.yaml up -d'
      }
    }

    stage('test app url') {
    steps {
        sh 'docker ps -a'
    }
}

    stage('Delay Before Integration Test') {
        steps {
            script {
                sleep time: 60, unit: 'SECONDS'
            }
        }
    }

    stage("Integration Test"){
      steps {
        sh 'npm start'
      }
    }
}
  post {
    always {
      sh 'docker compose -f docker-compose.yaml down'
    }
  }
}
