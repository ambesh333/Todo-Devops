# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Install bash
RUN apk add --no-cache bash

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

# Copy wait-for-it script
COPY wait-for-it.sh .

# Make the wait-for-it script executable
RUN chmod +x wait-for-it.sh

# Compile TypeScript to JavaScript
RUN npx tsc -b

# Expose the application port
EXPOSE 3000

# Use wait-for-it to wait for the database to be ready before starting the app
CMD ["./wait-for-it.sh", "postgres:5432", "--", "bash", "-c", "npx prisma migrate deploy && npx prisma generate && node dist/index.js"]
