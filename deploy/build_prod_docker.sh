#!/bin/bash
# Simple script to build production Docker images
DB_DOCKER_IMAGE="na-mongodb"
BACKEND_DOCKER_IMAGE="na-backend-api"
FRONTEND_DOCKER_IMAGE="na-frontend"

# Build Docker images.
read -p "You are going to replace the database, backend and frontend Docker images. Are you sure? " -n 1 -r
# TODO - Add branch name to this prompt.
echo    # Move to a new line.

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # Handle exits from shell or function but don't exit interactive shell.
fi

if [ "$1" == "latest" ]; then
  readonly TAG="$1"
else
  readonly TAG=$(git describe --always)
  echo "Building with tag ${TAG}."
fi

export TAG="${TAG}"

echo "Building and pushing database Docker."
docker build \
    -f data/Dockerfile.prod \
    -t bayesimpact/$DB_DOCKER_IMAGE:$TAG \
    -t bayesimpact/$DB_DOCKER_IMAGE:latest \
    ./data
docker push bayesimpact/$DB_DOCKER_IMAGE

echo "Building and pushing backend Docker."
docker build \
    -f web-app/backend/Dockerfile.prod \
    -t bayesimpact/$BACKEND_DOCKER_IMAGE:$TAG \
    -t bayesimpact/$BACKEND_DOCKER_IMAGE:latest \
    ./web-app/backend
docker push bayesimpact/$BACKEND_DOCKER_IMAGE

echo "Building and pushing frontend Docker."
docker build \
    -f web-app/frontend/Dockerfile.prod \
    -t bayesimpact/$FRONTEND_DOCKER_IMAGE:$TAG \
    -t bayesimpact/$FRONTEND_DOCKER_IMAGE:latest \
    ./web-app/frontend
docker push bayesimpact/$FRONTEND_DOCKER_IMAGE


# Deploy to ECS.
read -p "Would you like to deploy these new images with tag ${TAG}? Are you sure? " -n 1 -r
echo    # Move to a new line.
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # Handle exits from shell or function but don't exit interactive shell.
fi

# TODO - better handling of service update.
ecs-cli compose --file deploy/docker-compose-prod.yml --cluster network-adequacy --region us-west-1 service down

# Pause to prevent "InvalidParameterException: Unable to Start a service that is still Draining."
echo "Waiting for 2 minutes."
sleep 120s

ecs-cli compose --file deploy/docker-compose-prod.yml --cluster network-adequacy service up
ecs-cli compose --file deploy/docker-compose-prod.yml --cluster network-adequacy scale 2
