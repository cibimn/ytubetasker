# Use an official Node runtime as a base image
FROM node:14 as build-deps

# Set the working directory
WORKDIR /usr/src/app
COPY package.json yarn.lock ./

# Install project dependencies
RUN yarn install

# Copy the current directory contents into the container
COPY . .

RUN yarn build
# Make port 3000 available
EXPOSE 3000

# # Start the app
CMD ["yarn", "dev"]

# FROM nginx:1.12-alpine
# COPY --from=build-deps /usr/src/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]