# Use official Node.js lightweight Alpine image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to cache layers
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the backend source files
COPY . .

# Expose the backend port
EXPOSE 3000

# Define start command
CMD ["node", "server.js"]
