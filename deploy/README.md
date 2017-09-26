# Network-Adequacy

## Configure
We use `.prod` Dockerfiles to build prod version of the app and push to Docker Hub. You need the following before deploying to prod:

### AWS Credentials
- Make sure that your AWS credentials are up to date in ~/.aws/credentials under [bayes]
- Install and configure `aws-cli` command line tool with your AWS access keys
- Install `ecs-cli` command line tool
- Run `ecs-cli configure --profile bayes --cluster network-adequacy`
- Get the `na-server.pem` key (look it up on 1password)

## Initialize the network-adequacy cluster (Once only)
To create the ECS cluster used to deploy the Docker images, run

    deploy/initialize_cluster.sh

Note - This only needs tp be run once to create the cluster. Once the cluster exists, we can simply redeploy the docker inages using the `compose` command below.


## Build Docker images and deploy
To build and push prod Docker files, simply run

    deploy/build_prod_docker.sh

Once images are created, you will be prompted confirmation before deploying on the network-adequacy cluster.