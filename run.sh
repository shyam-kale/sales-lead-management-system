#!/bin/bash

echo "Starting Sales Lead Management System..."

# Start MySQL & Backend
docker-compose up -d

echo "Waiting for MySQL to initialize..."
sleep 20

# Start Backend (local fallback if not using Docker backend)
cd backend || exit
mvn clean install
mvn spring-boot:run &
cd ..

# Start Frontend
cd frontend || exit
npm install
npm run dev
