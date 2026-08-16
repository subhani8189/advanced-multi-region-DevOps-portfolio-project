pipeline {
    agent { 
        label 'slave-2' 
    }
    
    environment {
        DOCKERHUB_CREDENTIALS = 'docker-hub'
        DOCKER_REPO = 'subhani8189/my_portifilio-portfolio-web'
        IMAGE_TAG = "v${env.BUILD_NUMBER}" 
        CONTAINER_NAME = 'portfolio-web-app'
        HOST_PORT = '8081' 
    }apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio-deployment
  labels:
    app: portfolio-web
spec:
  # This tells Kubernetes to run 3 containers, automatically distributed across slave-1 and slave-2
  replicas: 3
  selector:
    matchLabels:
      app: portfolio-web
  template:
    metadata:
      labels:
        app: portfolio-web
    spec:
      containers:
      - name: portfolio-container
        # Jenkins will inject the exact version tag here
        image: subhani8189/my_portifilio-portfolio-web:__IMAGE_TAG__
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "250m"
            memory: "256Mi"
        
        # Auto-heals the container if it crashes on any slave node
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
          failureThreshold: 3
          
        # Ensures the Load Balancer only sends traffic to fully running containers
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
          successThreshold: 1
          failureThreshold: 3

---
apiVersion: v1
kind: Service
metadata:
  name: portfolio-loadbalancer
spec:
  type: LoadBalancer
  selector:
    app: portfolio-web 
  ports:
    - protocol: TCP
      port: 80       
      targetPort: 80

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
                    // Corrected mapping: Host Port (8081) connects to Container Port (80)
                    sh "docker run -d -p ${HOST_PORT}:80 --name ${CONTAINER_NAME} ${DOCKER_REPO}:${IMAGE_TAG}"
                }
            }
        }
    }
}
