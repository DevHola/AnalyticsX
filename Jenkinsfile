pipeline {
    agent any
    tools {
        nodejs "nodejs"
    }
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
                    sh "docker logs mongodb"
                }
            }
        }
         stage('Delay Before Last Step') {
            steps {
                script {
                    echo "Waiting for 30 seconds..."
                    sleep 60
                }
            }
        }
        stage('test') {
            steps {
                script {
                        // Run the commands in the 'nodeapp' container
                        sh "docker logs nodeapp"
                }
            }
        }
        
    }
    post {
        always {
            sh 'docker compose -f docker-compose.yaml down'
        }
    }
}
