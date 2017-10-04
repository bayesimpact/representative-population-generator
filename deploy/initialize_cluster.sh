#!/bin/bash
# Initialize ECS cluster.

# TODO - Check for existence of the cluster.

read -p "Would you like to initialize the network-adequacy cluster? Are you sure? " -n 1 -r
echo    # Move to a new line.
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # Handle exits from shell or function but don't exit interactive shell.
fi

N_INSTANCES=1

ecs-cli up --keypair na-server --capability-iam --size $N_INSTANCES --instance-type m4.large --port 80 --port 8080 --port 443

# Export TAG to use in docker-compose.
# Later deploys using build_prod_docker use git commit tags.
export TAG="latest"
ecs-cli compose --file deploy/docker-compose-prod.yml --cluster network-adequacy service create --load-balancer-name network-adequacy-lb

# Scale the number of tasks with the number of instances.
ecs-cli compose --file deploy/docker-compose-prod.yml --cluster network-adequacy scale $N_INSTANCES
