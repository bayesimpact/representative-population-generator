#!/bin/bash
# Simple script to build production Docker images
DOCKER_URL="bayesimpact"
DB_DOCKER_IMAGE="na-mongodb"
BACKEND_DOCKER_IMAGE="na-backend-api"
FRONTEND_DOCKER_IMAGE="na-frontend"

API_URL="http://network-adequacy-lb-950847297.us-west-1.elb.amazonaws.com:8080"

CLUSTER_NAME="network-adequacy"
LOAD_BALANCER_NAME="network-adequacy-lb"
N_INSTANCES=1

export BACKEND_IMAGE="$DOCKER_URL/$BACKEND_DOCKER_IMAGE"
export FRONTEND_IMAGE="$DOCKER_URL/$FRONTEND_DOCKER_IMAGE"
export DATABASE_IMAGE="$DOCKER_URL/$DATABASE_DOCKER_IMAGE"

# Get TAG.
if [ ! -z "$1" ]; then
  readonly TAG="$1"
else
  readonly TAG=$(git describe --always)
  echo "Building with tag ${TAG}."
fi

export TAG="${TAG}"

# Build Docker images.
read -p "You are going to replace the database, backend and frontend Docker images. Are you sure? " -n 1 -r
# TODO - Add branch name to this prompt.
echo    # Move to a new line.

if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Would you like to rebuild without cache? " -n 1 -r
    # TODO - Add branch name to this prompt.
    echo    # Move to a new line.
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      export CACHE="--no-cache"
      echo "Building with --no-cache."
    else
      export CACHE=""
      echo "Building using cache."
    fi

    echo "Building and pushing database Docker."
    docker rmi $DOCKER_URL/$DB_DOCKER_IMAGE
    eval docker build \
        -f web-app/database/Dockerfile.prod \
        -t $DOCKER_URL/$DB_DOCKER_IMAGE:$TAG \
        "${CACHE}" \
        ./web-app/database
    docker push $DOCKER_URL/$DB_DOCKER_IMAGE:$TAG 

    echo "Building and pushing backend Docker."
    docker rmi $DOCKER_URL/$BACKEND_DOCKER_IMAGE
    eval docker build \
        -f web-app/backend/Dockerfile.prod \
        -t $DOCKER_URL/$BACKEND_DOCKER_IMAGE:$TAG \
        "${CACHE}" \
        ./web-app/backend
    docker push $DOCKER_URL/$BACKEND_DOCKER_IMAGE:$TAG 

    echo "Building and pushing frontend Docker."
    docker rmi $DOCKER_URL/$FRONTEND_DOCKER_IMAGE
    eval docker build \
        -f web-app/frontend/Dockerfile.prod \
        -t $DOCKER_URL/$FRONTEND_DOCKER_IMAGE:$TAG \
        "${CACHE}" \
        ./web-app/frontend
    docker push $DOCKER_URL/$FRONTEND_DOCKER_IMAGE:$TAG 
fi

# Deploy to ECS.
read -p "Would you like to deploy these new images with tag ${TAG}? Are you sure? " -n 1 -r
echo    # Move to a new line.
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    # Handle exits from shell or function but don't exit interactive shell.
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
fi

# Check that MAPBOX_TOKEN is available.
if [ -z "${MAPBOX_TOKEN}" ]; then
    echo "Missing MAPBOX_TOKEN variable, please add it to your bash_profile or as a prefix to the deploy command."
    # Handle exits from shell or function but don't exit interactive shell.
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
fi

ecs-cli compose --file deploy/docker-compose-prod.yml --cluster $CLUSTER_NAME service up
ecs-cli compose --file deploy/docker-compose-prod.yml --cluster $CLUSTER_NAME service scale $N_INSTANCES
