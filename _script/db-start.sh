#/usr/bin bash

export STAGE="local"

docker-compose --log-level ERROR build "database"
docker-compose run --service-ports -d "database"

sleep 5s
