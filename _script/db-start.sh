#/usr/bin bash

docker build -t wechicken-database .

docker run -d -p 3307:3306 --name=wechicken-database wechicken-database:latest
