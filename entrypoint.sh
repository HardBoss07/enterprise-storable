#!/bin/sh

# Start Backend in background
echo "Starting Spring Boot Backend..."
java -jar /app/backend.jar &
BACKEND_PID=$!

# Wait for backend to be ready if needed, or just start frontend
echo "Starting Next.js Frontend..."
# Standalone mode expects to be run from its directory
cd /app/frontend && node server.js &
FRONTEND_PID=$!

# Exit if any of the processes die
wait -n $BACKEND_PID $FRONTEND_PID
exit $?
