pipeline {
  agent any
  stages {
    stage('Checkout code') {
      steps {
        git(url: 'https://github.com/DevHola/AnalyticsX', branch: 'Development')
      }
    }

    stage('') {
      steps {
        sh 'node --version'
      }
    }

  }
}