# Step 1: Build Stage
FROM node:18 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app files, including the .env file
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Step 2: Run Stage
FROM node:18

WORKDIR /app

# Copy compiled files from build stage
COPY --from=build /app/dist ./dist
COPY package*.json ./
COPY ./src/env/dev.env ./src/env/dev.env

# Install only production dependencies
RUN npm install --production

EXPOSE 3000

CMD ["node", "dist/index.js"]
