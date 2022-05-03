pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID="246069437619"
        AWS_DEFAULT_REGION="us-east-1" 
        REPOSITORY_URI = "246069437619.dkr.ecr.us-east-1.amazonaws.com/adminnew"
		IMAGE_TAG="246069437619.dkr.ecr.us-east-1.amazonaws.com/adminnew" + ":" +"${BUILD_NUMBER}"
		JOB_NAME= "${env.JOB_NAME}"
		RELEASE_NOTES= sh(script: "git show -s --pretty=format:%h", returnStdout: true).trim()
		COMMIT_MESSAGE= sh(script: "git show -s --pretty=%s", returnStdout: true).trim()
		Author_Name= sh(script: "git show -s --pretty=%an", returnStdout: true).trim()    
		IMAGE= "246069437619.dkr.ecr.us-east-1.amazonaws.com/adminnew"
		LAST_BUILD= "currentBuild.previousBuild.result"
		TERMINATED= "${env.IMAGE}"+ ":" +"${ENV.LAST_BUILD}"
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
				sh """
				docker push ${env.IMAGE_TAG}
				sed -i "s|newimage|${env.IMAGE_TAG}|g" docker-compose.yml
		        docker-compose up -d
				"""
         }
        }
      }
    stage('Run Container on Server Dev') {
	  steps{  
	      sh """
		  docker rmi ${env.TERMINATED} | true"
		  """
      }
    } 
    stage("Triggering") {
         steps {
            script{
               withCredentials([string(credentialsId: 'continous-integration-token', variable: 'TOKEN'),
               string(credentialsId: 'Telegramchatid', variable: 'CHAT_ID')]) {
               sh """
			   curl -X POST https://api.telegram.org/bot${TOKEN}/sendMessage -d chat_id=${CHAT_ID} -d text="Hi, Jenkins job: ${JOB_NAME} status is ${currentBuild.currentResult} , Committed by : ${env.Author_Name} , commit-id : ${env.RELEASE_NOTES} , commit msg : ${env.COMMIT_MESSAGE}"
                """
               }
            }
         }
       }
     }
 }
