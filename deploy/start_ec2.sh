#!/bin/bash

export MAPBOX_TOKEN=""
export SERVER_IP="35.180.26.194"

readonly DOCKER_URL="bayesimpact"
export BACKEND_IMAGE="$DOCKER_URL/na-mongodb"
export FRONTEND_IMAGE="$DOCKER_URL/na-backend-api"
export DATABASE_IMAGE="$DOCKER_URL/na-frontend"
export TAG="latest"

export WEBSITE_URL="$SERVER_IP:8080"

docker-compose -f docker-compose-prod.yml up -d
