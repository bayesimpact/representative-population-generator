#!/bin/bash
# Initialize ECS cluster.

# TODO - Check for existence of the cluster.

read -p "Would you like to deploy initialize the network-adequacy cluster? Are you sure? " -n 1 -r
echo    # Move to a new line.
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # Handle exits from shell or function but don't exit interactive shell.
fi

ecs-cli up --keypair na-server --capability-iam --size 2 --instance-type m3.medium
ecs-cli compose --file deploy/docker-compose-prod.yml service down
ecs-cli compose --file deploy/docker-compose-prod.yml service up
