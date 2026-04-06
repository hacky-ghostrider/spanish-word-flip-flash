pipeline {
  agent any

  options {
    ansiColor('xterm')
  }

  stages {
    stage('build') {
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }

    stage('test') {
      steps {
        sh 'npm run test:unit'
      }
    }

    stage('deploy') {
      steps {
        echo 'Mock deployment was successful!'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
    }
  }
}
