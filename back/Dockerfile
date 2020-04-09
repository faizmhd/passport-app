# Dockerfile for Node Express Backend api

FROM node:13.12.0-alpine3.10
# Working directory
WORKDIR /usr/src/app
# Copy all ressources
COPY . .
# Install dependencies
RUN npm install
# Expose the backend port
EXPOSE 8000
# Define the cmd to start the backend
CMD [ "node", "server.js" ]