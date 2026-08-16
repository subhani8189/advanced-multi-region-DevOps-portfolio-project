pipeline {
    agent { 
        label 'deploy-node' 
    }
    
    environment {
        DOCKERHUB_CREDENTIALS = 'docker-hub'
        DOCKER_REPO = 'subhani8189/my_portifilio-portfolio-web'
        IMAGE_TAG = "v${env.BUILD_NUMBER}" 
        
        // Kubernetes specific variables
        K8S_DEPLOYMENT = 'portfolio-deployment'
        K8S_CONTAINER = 'portfolio-container'
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

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // This command uses the config file we copied to the slave to update the cluster
                    sh "kubectl --kubeconfig=/home/ubuntu/.kube/config set image deployment/${K8S_DEPLOYMENT} ${K8S_CONTAINER}=${DOCKER_REPO}:${IMAGE_TAG}"
                }
            }
        }
    }
}
