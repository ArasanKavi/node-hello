pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID="246069437619"
        AWS_DEFAULT_REGION="us-east-1" 
        REPOSITORY_URI = "246069437619.dkr.ecr.us-east-1.amazonaws.com/adminnew"
		IMAGE_TAG="246069437619.dkr.ecr.us-east-1.amazonaws.com/adminnew" + ":" +"${BUILD_NUMBER}"
		SAMPLE= "1"
		BUILD_NEGATIVE= "${env.IMAGE_TAG}"+ "-" +"${env.SAMPLE}"
    }
   
    stages {
        
         stage('Logging into AWS ECR') {
            steps {
                script {
                sh "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 246069437619.dkr.ecr.us-east-1.amazonaws.com"
                }
                 
            }
        }
        
        stage('Cloning Git') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '', url: 'https://github.com/ArasanKavi/node-hello.git']]])     
            }
        }
  
    // Building Docker images
    stage('Building image') {
      steps{
        script {
          sh "docker build -t ${env.IMAGE_TAG} ."
        }
      }
    }
   
    // Uploading Docker images into AWS ECR
    stage('Pushing to ECR') {
     steps{  
         script {
				sh "docker push ${env.IMAGE_TAG}"
         }
        }
      }
    stage('Run Container on Server Dev') {
	  steps{  
	      sh """
		  sed -i "s|newimage|${env.IMAGE_TAG}|g" docker-compose.yml
		  docker-compose up -d
		  docker rmi -f ${env.BUILD_NEGATIVE}
		  """
      }
    } 
    stage("Triggering") {
         steps {
            script{
               withCredentials([string(credentialsId: 'continous-integration-token', variable: 'TOKEN'),
               string(credentialsId: 'telegramidgroup', variable: 'CHAT_ID')]) {
               sh """
               curl -s -X POST https://api.telegram.org/bot${TOKEN}/sendMessage -d chat_id=${CHAT_ID} -d parse_mode="HTML" -d text="<b>Project</b> : POC \
                <b>Branch</b>: master \
                <b>Build </b> : OK \
                <b>Test suite</b> = Passed"
                """
               }
            }
         }
       }
     }
 }
