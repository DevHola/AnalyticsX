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
        script {
            def serviceURL = "http://localhost:7000/"
            def response = sh(script: "curl -s --head ${serviceURL}", returnStatus: true, returnStdout: true)
            
            // Check if the response is an integer (exit code)
            if (response instanceof Integer) {
                echo "Response from ${serviceURL} (Exit Code): ${response}"
            } else {
                echo "Response from ${serviceURL}: ${response}"
            }
        }
    }
}



    stage("Integration Test"){
      steps {
        sh 'npm test'
      }
    }
}
  post {
    always {
      sh 'docker compose -f docker-compose.yaml down'
    }
  }
}
