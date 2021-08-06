#/usr/bin bash

export ECR_DOMAIN="193634490577.dkr.ecr.ap-northeast-2.amazonaws.com"
export STAGE="local"

docker-compose --log-level ERROR build "database" && \
docker-compose --log-level ERROR build "local" && \
docker-compose run --service-ports -d "local"

sleep 5s