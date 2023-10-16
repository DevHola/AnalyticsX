pipeline {
  agent any
  tools {nodejs "NodeJS"}
  stages {
    stage('Checkout code') {
      steps {
        git(url: 'https://github.com/DevHola/AnalyticsX', branch: 'Development')
      }
    }

    stage('node version') {
      steps {
        sh 'node --version'
      }
    }

  }
}
