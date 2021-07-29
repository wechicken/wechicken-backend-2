#/usr/bin bash

export STAGE="local"

docker-compose --log-level ERROR build "database" && \
docker-compose --log-level ERROR build "local" && \
docker-compose run --service-ports -d "local"

sleep 10s
