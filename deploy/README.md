# Representative-Population-Generator

## Config
### ECS
We use ECS to deploy our docker images. The following scripts assume that you have the necessary access on AWS to create and update ECS clusters.

### AWS Credentials
- Make sure that your AWS credentials are up to date in ~/.aws/credentials under [bayes]
- Install and configure `aws-cli` command line tool with your AWS access keys
- Install `ecs-cli` command line tool
- Run `ecs-cli configure --profile bayes --cluster representative-population-generator --region usrepresentative-population-generator-west-1`
- Get the `na-server.pem` key (look it up on 1password)

### Mapbox
- Make sure that the environment variable MAPBOX_TOKEN is set up in your bash_profile, or as prefix to your deploy command.

### API Url & Docker Repository
Before your first run, you will need to configure all the necessary variables at the top of the two deploy files:
	deploy/initialize_cluster.sh
	deploy/build_prod_docker.sh

## Deploy
### Initialization
#### AWS ELB (Once Only!)
To ensure that the website address that you have setup and your cluster are always linked, we recommand setting up a new ELB on AWS. The ELB will then be used when initializing the ECS cluster. Once this is done, update the LOAD_BALANCER_NAME variable in `deploy/initialize_cluster.sh`.

### Initialize the ECS cluster (Once Only!)
To create the ECS cluster used to deploy the Docker images, run:

    deploy/dmhc_deploy/initialize_cluster.sh

Note - This only needs tp be run once to create the cluster. Once the cluster exists, we can simply redeploy the docker images using the `compose` command below.

## Build Docker images and deploy
To update and build and push production Docker files, simply run:

    deploy/build_prod_docker.sh

Once images are created, you will be prompted confirmation before deploying on the representative-population-generator cluster.

## Debugging
If you need to investigate what is happening on the instance, you can ssh into one of the ECS instance.
You can then access logs here: `cat /var/log/ecs/ecs-agent.log.YEAR-MONTH-DAY-HOUR`
