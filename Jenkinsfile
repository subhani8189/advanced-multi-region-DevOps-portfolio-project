pipeline {
    agent { 
        label 'deploy-node' 
    }
    
    environment {
        DOCKERHUB_CREDENTIALS = 'docker-hub'
        DOCKER_REPO = 'subhani8189/my_portifilio-portfolio-web'
        IMAGE_TAG = "v${env.BUILD_NUMBER}" 
        CONTAINER_NAME = 'portfolio-web-app'
        HOST_PORT = '80' 
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
                    sh "docker rm -f ${CONTAINER_NAME} || true"
                    sh "docker run -d -p ${HOST_PORT}:80 --name ${CONTAINER_NAME} ${DOCKER_REPO}:${IMAGE_TAG}"
                }
            }
        }
    }
}
