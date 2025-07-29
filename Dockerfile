# Use the latest LTS version of Node.js
FROM node:24.4.0-alpine
 
# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package*.json ./
 
# Install dependencies
RUN npm install
 
# Copy the rest of your application files
COPY . .
 
# Expose the port your app runs on
EXPOSE 3000
 
# Define the command to run your app
CMD ["npm", "run" , "dev"]

#production
#FROM node:24.4.0-alpine AS build
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#RUN npm run build

#FROM node:24.4.0-alpine
#WORKDIR /app
#RUN npm install -g serve
#COPY --from=build /app/dist /app/dist
#EXPOSE 3000
#CMD ["serve", "-s", "dist", "-l", "3000"]
# Stage 1: Build the application
#FROM node:24-alpine AS builder

#WORKDIR /app

#COPY package*.json ./

#RUN npm install

#COPY . .

#RUN npm run build

# Stage 2: Serve the application
#FROM node:24-alpine AS server

#WORKDIR /app

#RUN npm install -g serve

#COPY --from=builder /app/dist .

#EXPOSE 3000

#CMD ["serve", "-s", ".", "-l", "3000"]
