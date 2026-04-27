#!/bin/sh

# Start the Spring Boot Backend in the background
echo "Starting Spring Boot Backend on port 8080..."
java -jar /app/backend.jar > /app/storage/backend.log 2>&1 &

# Start the Next.js Frontend
echo "Starting Next.js Frontend on port 3000..."
# standalone mode entry point is server.js
exec node server.js