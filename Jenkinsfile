pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = 'docker-hub'
        DOCKER_REPO = 'subhani8189/my_portifilio-portfolio-web'
        IMAGE_TAG = "v${env.BUILD_NUMBER}" 
        // Define container details
        CONTAINER_NAME = 'portfolio-web-app'
        // Using 8081 since Jenkins usually runs on 8080
        HOST_PORT = '8081' 
    }

    stages {
        stage('Clone Application Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_REPO}:${IMAGE_TAG} -t ${DOCKER_REPO}:latest ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                        sh "docker push ${DOCKER_REPO}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_REPO}:latest"
                    }
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // 1. Remove the old container if it exists (the '|| true' prevents the build from failing if it doesn't exist yet)
                    sh "docker rm -f ${CONTAINER_NAME} || true"
                    
                    // 2. Run the new container in detached mode (-d)
                    sh "docker run -d -p ${HOST_PORT}:80 --name ${CONTAINER_NAME} ${DOCKER_REPO}:${IMAGE_TAG}"
                }
            }
        }
    }
}
