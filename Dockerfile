# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and migrations
COPY prisma ./prisma

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc -b

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && node dist/index.js"]
