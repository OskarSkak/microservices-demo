# Use a Node.js base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build your TypeScript files (if needed)
RUN npm run build

# Your app's port, change if different
EXPOSE 3000

# Command to run your app
CMD ["node", "dist/index.js"]
