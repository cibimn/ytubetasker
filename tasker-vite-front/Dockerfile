# Use an official Node runtime as a base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for installing node modules
COPY package*.json ./

# Install project dependencies
RUN yarn run dev

# Copy the current directory contents into the container
COPY . .

# Make port 3000 available
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
