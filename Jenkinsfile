pipeline {
    agent any
    
    environment {
        // Docker Credentials & Repo
        DOCKERHUB_CREDENTIALS = 'docker-hub'
        DOCKER_REPO = 'subhani8189/my_portifilio-portfolio-web'
        IMAGE_TAG = "v${env.BUILD_NUMBER}" 
        
        // Docker Local Run Variables
        CONTAINER_NAME = 'portfolio-web-app'
        HOST_PORT = '8081' 
        
        // Kubernetes Variables (Update these to match your actual K8s deployment names)
        K8S_DEPLOYMENT_NAME = 'portfolio-deployment'
        K8S_CONTAINER_NAME = 'portfolio-container'
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

        stage('Run Locally in Docker') {
            steps {
                script {
                    sh "docker rm -f ${CONTAINER_NAME} || true"
                    sh "docker run -d -p ${HOST_PORT}:80 --name ${CONTAINER_NAME} ${DOCKER_REPO}:${IMAGE_TAG}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // This command updates the live Kubernetes deployment with your newly pushed Docker image
                    sh "kubectl set image deployment/${K8S_DEPLOYMENT_NAME} ${K8S_CONTAINER_NAME}=${DOCKER_REPO}:${IMAGE_TAG}"
                    
                    // Optional: Check the rollout status to ensure it deployed successfully
                    sh "kubectl rollout status deployment/${K8S_DEPLOYMENT_NAME}"
                }
            }
        }
    }
}
