# Dockerfile for Node Express Backend api

FROM node:10
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 8000
CMD [ "node", "server.js" ]