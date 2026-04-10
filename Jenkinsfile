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
      parallel {
        stage('unit tests') {
          agent {
            docker {
              image 'node:22-alpine'
              reuseNode true
            }
          }
          steps {
            sh 'npm ci'
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
          environment {
            PLAYWRIGHT_REPORT_DIR = 'reports-e2e/integration'
          }
          steps {
            sh 'npm ci'
            sh 'npx playwright test'
          }
          post {
            always {
              archiveArtifacts artifacts: 'reports-e2e/integration/**/*', allowEmptyArchive: true
              script {
                if (fileExists('reports-e2e/integration/html/index.html')) {
                  publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    icon: '',
                    keepAll: true,
                    reportDir: 'reports-e2e/integration/html',
                    reportFiles: 'index.html',
                    reportName: 'Playwright HTML Report - Integration',
                    reportTitles: ''
                  ])
                }
              }
              junit stdioRetention: 'All', testResults: 'reports-e2e/integration/junit.xml'
            }
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
        echo 'Mock deployment was successful!'
      }
    }

    stage('e2e') {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.54.2-jammy'
          reuseNode true
        }
      }
      environment {
        E2E_BASE_URL = 'https://spanish-cards.netlify.app/'
        PLAYWRIGHT_REPORT_DIR = 'reports-e2e/e2e'
      }
      steps {
        sh 'npm ci'
        sh 'npx playwright test'
      }
      post {
        always {
          archiveArtifacts artifacts: 'reports-e2e/e2e/**/*', allowEmptyArchive: true
          script {
            if (fileExists('reports-e2e/e2e/html/index.html')) {
              publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                icon: '',
                keepAll: true,
                reportDir: 'reports-e2e/e2e/html',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report - E2E',
                reportTitles: ''
              ])
            }
          }
          junit stdioRetention: 'All', testResults: 'reports-e2e/e2e/junit.xml'
        }
      }
    }
  }
}
