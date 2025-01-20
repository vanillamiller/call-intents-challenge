#!/bin/bash
START_TIME=$(date -R)
GLOBAL_OVERRIDES=$1
export AWS_REGION=ap-southeast-2
export APP_NAME=call-intents
export ENVIRONMENT_NAME=dev

checkIfFailed() {
  latestReturnCode=$?
  if [ $latestReturnCode -ne 0 ]; then
    echo "Fail code found ($latestReturnCode)...exiting pipeline"
    exit 255
  fi
}

export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
checkIfFailed
export DEPLOYMENT_BUCKET_NAME="${APP_NAME}-${ENVIRONMENT_NAME}-${AWS_ACCOUNT_ID}-deployment"
aws s3 cp dist/index.zip s3://${DEPLOYMENT_BUCKET_NAME}/prisma-layer/index.zip
checkIfFailed

aws lambda publish-layer-version \
  --layer-name prisma-layer \
  --description "generated prisma client" \
  --content S3Bucket=${DEPLOYMENT_BUCKET_NAME},S3Key=prisma-layer/index.zip \
  --compatible-runtimes nodejs22.x \
  --region ap-southeast-2
checkIfFailed