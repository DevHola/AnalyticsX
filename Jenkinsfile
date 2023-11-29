pipeline {
  agent any
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

    stage('Docker Container Debug') {
      steps {
        script {
          sh "docker exec nodeapp sh -c 'nslookup mongodb'"
        }

      }
    }

    stage('mtest') {
      steps {
        script {
          timeout(time: 1, unit: 'MINUTES') {
            // Run the commands in the 'nodeapp' container
            sh "docker logs nodeapp"
          }
        }

      }
    }

    stage('test') {
      steps {
        script {
          timeout(time: 1.5, unit: 'MINUTES') {
            script {
              // Run the commands in the 'nodeapp' container
              sh "docker logs nodeapp"
            }
          }
        }

      }
    }

  }
  tools {
    nodejs 'nodejs'
  }
  post {
    always {
      sh 'docker compose -f docker-compose.yaml down'
    }

  }
}