# Use Node LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app source
COPY . .

# Build the app (adjust if your build command is different)
RUN npm run build

# Expose the port your app runs on (adjust if needed)
EXPOSE 3000

# Start the app (adjust if your start command is different)
CMD ["npm", "start"]
