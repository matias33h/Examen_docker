# Use an official runtime as a parent image, for example, Node.js
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json file and install dependencies
COPY package.json .
RUN npm install

# Bundle the source code inside the Docker image
COPY . .

# Make port available to the world outside this container
EXPOSE 8080

# Define the command to run the app
CMD [ "npm", "start" ]
