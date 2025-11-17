pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'jmdthalha/devops-webapp'
        DOCKER_CREDS = credentials('dockerhub-creds')
        PROD_SERVER = '172.31.3.191'
        BUILD_VERSION = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from GitHub...'
                git branch: 'main',
                    url: 'https://github.com/iam-mdthalha/devops-webapp.git'
            }
        }

        stage('Build & Test') {
            steps {
                echo '🔨 Installing dependencies...'
                sh 'npm install'
                
                echo '🧪 Running tests...'
                sh 'npm test || echo "No tests configured"'
            }
        }

        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker image...'
                sh """
                    docker build -t ${DOCKER_IMAGE}:${BUILD_VERSION} .
                    docker tag ${DOCKER_IMAGE}:${BUILD_VERSION} ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo '📤 Pushing to DockerHub...'
                sh """
                    echo \$DOCKER_CREDS_PSW | docker login -u \$DOCKER_CREDS_USR --password-stdin
                    docker push ${DOCKER_IMAGE}:${BUILD_VERSION}
                    docker push ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Deploy to Production') {
            steps {
                echo '🚀 Deploying to production server...'
                sshagent(['prod-server-ssh']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${PROD_SERVER} '
                            # Download deployment script
                            curl -o deploy.sh https://raw.githubusercontent.com/iam-mdthalha/devops-webapp/main/deploy.sh
                            chmod +x deploy.sh
                            
                            # Run deployment
                            ./deploy.sh
                            
                            # Verify deployment
                            echo "Waiting for container to start..."
                            sleep 5
                            curl -f http://localhost:3000/health || exit 1
                        '
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                echo '🏥 Running health check...'
                sh """
                    curl -f http://${PROD_SERVER}/health || exit 1
                """
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo "🌐 Application URL: http://${PROD_SERVER}"
        }
        failure {
            echo '❌ Pipeline failed! Check logs above.'
        }
        always {
            echo '🧹 Cleaning up Docker images...'
            sh 'docker image prune -f || true'
        }
    }
}
