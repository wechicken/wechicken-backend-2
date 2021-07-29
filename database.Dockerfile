FROM mysql:5.7

ENV MYSQL_ROOT_PASSWORD password
ENV MYSQL_DATABASE wechicken

CMD ["--character-set-server=utf8", "--collation-server=utf8_general_ci", "--skip-character-set-client-handshake"]

EXPOSE 3306
