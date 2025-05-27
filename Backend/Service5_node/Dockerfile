# Use the official Node.js image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Expose the port your app uses
EXPOSE 5005

# Run the app
CMD ["npm", "start"]
