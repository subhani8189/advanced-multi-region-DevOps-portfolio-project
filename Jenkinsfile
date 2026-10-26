pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'subhani8189/devops-portfolio:latest'
        // This matches the ID you just created in Jenkins
        DOCKER_CREDS = 'dockerhub-creds' 
    }
    
    stages {
        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }
        
        stage('SonarQube Code Analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv('SonarQube-Server') {
                        sh "${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=portfolio-project \
                            -Dsonar.projectName=portfolio-project \
                            -Dsonar.sources=."
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE} ."
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDS, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                        sh "docker push ${DOCKER_IMAGE}"
                    }
                }
            }
        }
    }
}
