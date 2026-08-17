pipeline {
    agent { 
        label 'slave-2' 
    }
    
    environment {
        DOCKERHUB_CREDENTIALS = 'docker-hub'
        DOCKER_REPO = 'subhani8189/my_portifilio-portfolio-web'
        IMAGE_TAG = "v${env.BUILD_NUMBER}" 
    }

    stages {
        stage('Clone and Debug') {
            steps {
                // 1. Wipe workspace
                deleteDir() 
                checkout scm
                
                script {
                    echo "============================================="
                    echo "1. WHAT COMMIT DID JENKINS PULL?"
                    echo "============================================="
                    sh "git log -1"
                    
                    echo "============================================="
                    echo "2. WHAT DOES THE HTML FILE LOOK LIKE ON DISK?"
                    echo "============================================="
                    sh "cat index.html | head -n 15"
                    
                    echo "============================================="
                    echo "3. BUILDING DOCKER IMAGE WITHOUT CACHE"
                    echo "============================================="
                    sh "docker build --no-cache -t ${DOCKER_REPO}:${IMAGE_TAG} -t ${DOCKER_REPO}:latest ."
                    
                    echo "============================================="
                    echo "4. WHAT IS INSIDE THE NEW DOCKER IMAGE?"
                    echo "============================================="
                    // This creates a temporary container just to read the file inside it!
                    sh "docker run --rm ${DOCKER_REPO}:${IMAGE_TAG} cat /usr/share/nginx/html/index.html | head -n 15"
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

        stage('Deploy to Kubernetes Cluster') {
            steps {
                script {
                    // Read the template and output a NEW file called deploy.yaml
                    sh "sed 's/__IMAGE_TAG__/${IMAGE_TAG}/g' portfolio-app.yaml > deploy.yaml"
                    
                    // Apply the newly generated file
                    sh "kubectl --kubeconfig=/home/ubuntu/.kube/config apply -f deploy.yaml"
                    
                    // Force K8s to terminate the old pods and pull the new image
                    sh "kubectl --kubeconfig=/home/ubuntu/.kube/config rollout restart deployment/portfolio-deployment"
                    
                    // Wait for the rollout to finish successfully
                    sh "kubectl --kubeconfig=/home/ubuntu/.kube/config rollout status deployment/portfolio-deployment"
                }
            }
        }
    }
}
