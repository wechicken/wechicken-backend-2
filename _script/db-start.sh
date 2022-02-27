#/usr/bin bash

docker build -t wechicken-database .
# M1 칩일 경우: \ --platform linux/amd64

docker run -d -p 3307:3306 --name=wechicken-database wechicken-database:latest
