# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set working directory inside the build container
WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./

# Install all dependencies (required to build)
RUN npm install

# Copy application source
COPY . .

# Build production assets (outputs to /usr/src/app/dist)
RUN npm run build

# Stage 2: Serve the production assets with Nginx
FROM nginx:stable-alpine

# Copy the custom build artifacts to the default Nginx public directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
