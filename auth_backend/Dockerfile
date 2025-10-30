# Use a Node.js 18 image
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (PRD: 8001)
EXPOSE 8001

# Start the server
CMD ["npm", "start"]