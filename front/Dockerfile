# Dockerfile for React Frontend

FROM node:13.12.0-alpine3.10
# Working directory
WORKDIR /usr/src/app
# Copy all ressources
COPY . .
# Install dependencies
RUN npm install
# Expose the backend port
EXPOSE 3000
# Define the cmd to start the backend
CMD [ "npm", "start" ]