#!/bin/bash
START_TIME=$(date -R)
GLOBAL_OVERRIDES=$1
export AWS_REGION=ap-southeast-2
export APP_NAME=call-intents
export ENVIRONMENT_NAME=dev

loadDotEnv(){
  while read -r line; do
    [[ $line =~ ^#.*$ ]] && continue
    [[ -z "$line" ]] && continue

    export "$line"
  done < .env
}

checkIfFailed() {
  latestReturnCode=$?
  if [ $latestReturnCode -ne 0 ]; then
    echo "Fail code found ($latestReturnCode)...exiting pipeline"
    exit 255
  fi
}

getStackOutputs() {
    stackOutputs=$(aws cloudformation describe-stacks --region ${AWS_REGION} --stack-name ${1} | jq -r '.Stacks[0].Outputs | map({key:.OutputKey,value:.OutputValue})| .[] | "Stack_" + .key + "=" + .value')
    if [[ -z "$stackOutputs" ]]; then
        if [ "${2}" = "noexit" ]; then
            return
        fi
        echo "Failed to retrieve stack outputs from stack (${1})"
        echo "Aborting pipeline"
        exit 255
    else
        echo "Succesfully retrieved values from ${1}"
        for key in ${stackOutputs}; do
            echo "${key}"
            export ${key}
        done
    fi
}

setOutput() {
    echo "::set-output name=${1}::${2}"
    echo "${1}: ${2}"
}

export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)

if [ -z "${AWS_ACCOUNT_ID}" ]; then
  echo "AWS_ACCOUNT_ID not set"
  exit 1
fi

export APP_STACK_NAME=${APP_NAME}-${ENVIRONMENT_NAME}-app
export STACK_NAME=${APP_NAME}-${ENVIRONMENT_NAME}-api
export DEPLOYMENT_BUCKET_NAME="${APP_NAME}-${ENVIRONMENT_NAME}-${AWS_ACCOUNT_ID}-deployment"

loadDotEnv

# Create S3 Bucket to store code
echo "Creating S3 Bucket..."
aws s3api head-bucket --bucket "${DEPLOYMENT_BUCKET_NAME}"  2>&1 >/dev/null ||
    aws s3 mb s3://${DEPLOYMENT_BUCKET_NAME}

checkIfFailed

getStackOutputs ${APP_STACK_NAME}
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id ${Stack_CloudFrontId} --query 'Distribution.DomainName' --output text)

echo "SAM: Packaging ${APP_NAME}.yml..."
sam package \
    --s3-bucket ${DEPLOYMENT_BUCKET_NAME} \
    --s3-prefix ${APP_NAME}-api \
    --template-file cfn/api.yml \
    --output-template-file cfn/api-packaged.yml \
    --region ${AWS_REGION}
checkIfFailed

echo "SAM: Deploying ${APP_NAME}.yml..."
sam deploy --template-file cfn/api-packaged.yml \
    --s3-bucket ${DEPLOYMENT_BUCKET_NAME} \
    --s3-prefix ${APP_NAME}-api \
    --stack-name ${STACK_NAME} \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ${AWS_REGION} \
    --no-fail-on-empty-changeset \
    --parameter-overrides \
      ParameterKey=pCorsOrigin,ParameterValue=${ENVIRONMENT_NAME} \
      ParameterKey=pPrismaLayerVersion,ParameterValue=${PRISMA_LAYER_VERSION} \
      ParameterKey=pDatabaseUrl,ParameterValue=${DATABASE_URL} \
      ParameterKey=pCorsOrigin,ParameterValue=${CLOUDFRONT_DOMAIN}


checkIfFailed

END_TIME=$(date -R)

echo "Start time : ${START_TIME}"
echo "End time   : ${END_TIME}"