pipeline {
  agent any

  environment {
    REPO_URL = 'https://github.com/voluntarios/ccss_consultory_fnt.git'
    BRANCH = 'QA'
    IMAGE_NAME = 'ccss-frontend'
    CONTAINER_NAME = 'ccss-frontend-app'
  }

  stages {
    stage('Build Docker Image') {
      steps {
        sh 'docker build -t ${IMAGE_NAME}:latest .'
      }
    }

    stage('Deploy Container') {
      steps {
        sh 'docker rm -f ${CONTAINER_NAME} || true'
        sh 'docker run -d --name ${CONTAINER_NAME} -p 5173:80 ${IMAGE_NAME}:latest'
      }
    }
  }

  post {
    success {
      echo 'Deploy completado. App disponible en http://localhost:5173'
    }
  }
}
