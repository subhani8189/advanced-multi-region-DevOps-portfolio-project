pipeline {
    agent any
    
    // Define your environment variables here
    environment {
        DOCKERHUB_CREDENTIALS = 'your-dockerhub-credentials-id'
        DOCKER_IMAGE = 'subhani8189/my_portifilio-portfolio-web:latest'
        // Using the Jenkins BUILD_NUMBER to create unique tags for every push
        IMAGE_TAG = "v${env.BUILD_NUMBER}" 
    }

    stages {
        stage('Clone Application Code') {
            steps {
                // Jenkins automatically pulls your code here
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Builds the image using your Dockerfile
                    sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    // Logs in and pushes the image
                    withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                        sh "docker push ${DOCKER_IMAGE}:${IMAGE_TAG}"
                    }
                }
            }
        }
    }
}