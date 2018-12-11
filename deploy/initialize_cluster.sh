#!/bin/bash
# Initialize ECS cluster.

# AWS Settings
AWS_PROFILE="bayes"
AWS_REGION="eu-west-3"
AWS_KEY_PAIR="na-server"

# Cluster Settings
CLUSTER_NAME="representative-population-generator"
SHORT_CLUSTER_NAME="rpg"
LOAD_BALANCER_NAME="network-adequacy-lb"
N_INSTANCES=1

# Docker Settings
DOCKER_URL="bayesimpact"
export BACKEND_IMAGE="$DOCKER_URL/na-mongodb"
export FRONTEND_IMAGE="$DOCKER_URL/na-backend-api"
export DATABASE_IMAGE="$DOCKER_URL/na-frontend"

# TODO - Check for existence of the cluster.
read -p "Would you like to initialize the network-adequacy cluster? Are you sure? " -n 1 -r
echo    # Move to a new line.
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # Handle exits from shell or function but don't exit interactive shell.
fi

set -x

# Configure cluster.
ecs-cli configure --cluster $CLUSTER_NAME --region $AWS_REGION
ecs-cli up --keypair $AWS_KEY_PAIR --capability-iam --size $N_INSTANCES --instance-type m5.large --port 80 --port 8080 --port 443

# Find the VPC of the ECS cluster.
VPC_ID=$(aws ec2 describe-vpcs --filters=Name=tag:aws:cloudformation:stack-name,Values=amazon-ecs-cli-setup-$CLUSTER_NAME | grep \"VpcId\" | grep -o "vpc-[0-9a-f]\\+")

# Creatte Load Balancer.
if ! aws elb describe-load-balancer-attributes --load-balancer-name $LOAD_BALANCER_NAME --region $AWS_REGION > /dev/null; then
  echo Need to create load balancer first.
  SUBNETS=$(aws ec2 describe-subnets --filters Name=vpc-id,Values=$VPC_ID | grep \"SubnetId\" | grep -o "subnet-[0-9a-f]\\+" | tr '\n' ' ')
  aws elbv2 create-load-balancer --type application --name $LOAD_BALANCER_NAME --subnets $SUBNETS
fi
LOAD_BALANCER_ARN=$(aws elbv2 describe-load-balancers --names $LOAD_BALANCER_NAME | grep \"LoadBalancerArn\" | grep -o "arn:[^\"]\\+")

# Create target groups.
aws elbv2 create-target-group --name=$SHORT_CLUSTER_NAME-webapp --protocol=HTTP --port=80 --vpc-id=$VPC_ID
aws elbv2 create-target-group --name=$SHORT_CLUSTER_NAME-backend --protocol=HTTP --port=8080 --vpc-id=$VPC_ID

# Create listeners
WEBAPP_TARGET_GROUP_ARN=$(aws elbv2 describe-target-groups --names $SHORT_CLUSTER_NAME-webapp | grep \"TargetGroupArn\" | grep -o "arn:[^\"]\\+")
aws elbv2 create-listener --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=$WEBAPP_TARGET_GROUP_ARN --load-balancer-arn $LOAD_BALANCER_ARN
BACKEND_TARGET_GROUP_ARN=$(aws elbv2 describe-target-groups --names $SHORT_CLUSTER_NAME-backend | grep \"TargetGroupArn\" | grep -o "arn:[^\"]\\+")
aws elbv2 create-listener --protocol HTTP --port 8080 --default-actions Type=forward,TargetGroupArn=$BACKEND_TARGET_GROUP_ARN --load-balancer-arn $LOAD_BALANCER_ARN

LOAD_BALANCER_DNS_NAME=$(aws elbv2 describe-load-balancers --names $LOAD_BALANCER_NAME | grep \"DNSName\" | grep -o "[^\"]\\+.amazonaws.com")
export WEBSITE_URL="$LOAD_BALANCER_DNS_NAME:8080"

# Export TAG to use in docker-compose.
# Later deploys using build_prod_docker use git commit tags.
export TAG="latest"
ecs-cli compose --file deploy/docker-compose-prod.yml --cluster $CLUSTER_NAME service create

# Scale the number of tasks with the number of instances.
ecs-cli compose --file deploy/docker-compose-prod.yml --cluster $CLUSTER_NAME scale $N_INSTANCES
