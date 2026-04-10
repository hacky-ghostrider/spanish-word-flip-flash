pipeline {
  agent any

  options {
    ansiColor('xterm')
  }

  stages {
    stage('build') {
      agent {
        docker {
          image 'node:22-alpine'
          reuseNode true
        }
      }
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }

    stage('test') {
      parallel{
        stage('unit tests') {
          agent {
            docker {
              image 'node:22-alpine'
              reuseNode true
            }
          }
          steps {
            sh 'npm ci'
            //Unit tests with VItest
            sh 'npx vitest run --reporter=verbose'
          }
        }
        stage('integration tests') {
          agent {
            docker {
              image 'mcr.microsoft.com/playwright:v1.54.2-jammy'
              reuseNode true
            }
      }
      steps {
        sh 'npm ci'
        sh 'npx playwright test'
      }
    }
  }
  }

    stage('deploy') {
      agent {
        docker {
          image 'alpine'
          reuseNode true
        }
      }
      steps {
        //Mock deployment which does nothing
        echo 'Mock deployment was successful!'
      }
    }
    stage('e2e'){
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.54.2-jammy'
          reuseNode true
        }
      }
    environment{
      E2E_BASE_URL = 'https://spanish-cards.netlify.app/'
    }

      steps {
        sh 'npm ci'
        sh 'npx playwright test'
      }
      post {
        always {
          //Archive Playwright test results and screenshots
                pubishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    icon:'',
                    keepAll: false,
                    reportDir: 'reports-e2e/html/',
                    reportFiles: 'index.html',
                    reportName: 'Playwright HTML Report',
                    reportTitles: '',
                    useWrapperFileDirectory: true
                ])  
                junit stdioRetention:'All', testResults: 'reports-e2e/junit.xml'
        }
      }
    }
  }
}
