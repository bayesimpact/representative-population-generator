#!/bin/bash

# Update these two with actual values before deploying.
export MAPBOX_TOKEN="XXXXXxxxXXXX"
export SERVER_IP="XX.XXX.XX.XXX"

readonly DOCKER_URL="bayesimpact"
export BACKEND_IMAGE="$DOCKER_URL/na-backend-api"
export FRONTEND_IMAGE="$DOCKER_URL/na-frontend"
export DATABASE_IMAGE="$DOCKER_URL/na-mongodb"
export TAG="latest"

export WEBSITE_URL="http://$SERVER_IP:8080"

docker-compose -f docker-compose-prod.yml up -d
