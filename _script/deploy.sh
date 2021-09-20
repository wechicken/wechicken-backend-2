#/usr/bin/env bash
set -e

export AWS_PROFILE=wechicken
# export STAGE="development"

# Main deployment
echo "[[DEPLOY SYSTEM]] Starting Deployment"

npx sls deploy

echo "[[DEPLOY SYSTEM]] End Deployment"
