# Use Node 20 LTS base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies defined in package.json
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose port 3000 for the development server
EXPOSE 3000

# Run the application
CMD ["node", "server.js"]
