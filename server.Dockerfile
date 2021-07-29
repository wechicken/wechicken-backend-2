FROM node:14

WORKDIR /app

COPY _script/wait-for-it.sh .
COPY dist .
COPY package.json .

RUN chmod +x wait-for-it.sh
RUN npm install

ARG STAGE

ENV STAGE $STAGE

EXPOSE 3000
