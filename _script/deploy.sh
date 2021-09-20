#/usr/bin/env bash
set -e

export AWS_PROFILE=wechicken

# Main deployment
echo "[[DEPLOY SYSTEM]] Starting Deployment"

sls deploy

echo "[[DEPLOY SYSTEM]] End Deployment"
