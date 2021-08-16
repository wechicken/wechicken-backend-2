#/usr/bin/env bash
set -e

export AWS_PROFILE=wechicken
export STAGE="development"
export ECR_DOMAIN="193634490577.dkr.ecr.ap-northeast-2.amazonaws.com"

# Login 
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin $ECR_DOMAIN

# Set Cluster, Package Name
CLUSTER_NAME='Wechicken'
PACKAGE_NAME='wechicken'

# Main deployment
echo "[[DEPLOY SYSTEM]] Starting Deployment"

docker-compose build $STAGE
docker-compose push $STAGE

aws ecs update-service --cluster $CLUSTER_NAME --service "wechicken-$STAGE" --force-new-deployment &

echo "[[DEPLOY SYSTEM]] End Deployment"
