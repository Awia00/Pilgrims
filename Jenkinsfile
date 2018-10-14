properties([
    buildDiscarder(logRotator(numToKeepStr: '3'))
])
node('docker&&linux') {
    stage('Fetch SCM') {
        checkout scm
    }
    stage('Website Build') {
        def shared = docker build('pilgrims/pilgrims-shared', './pilgrims-shared');
        def client = docker.build('pilgrims/pilgrims-client', './pilgrims-client')
        def server = docker.build('pilgrims/pilgrims-server', './pilgrims-server')
    }
    stage('Tests') {
        sh """
            docker run --rm pilgrims/pilgrims-shared
        """
    }
    stage('Deploy') {
        sh 'docker-compose up -d'
    }
}