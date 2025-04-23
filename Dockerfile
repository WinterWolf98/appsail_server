# Use the official Node.js image as the base
FROM --platform=amd64 node:23-slim

ENV http_proxy="http://192.168.100.100:3128"
ENV https_proxy="http://192.168.100.100:3128"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    procps

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# transpile ts files
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "./build/lib/index.js"]
