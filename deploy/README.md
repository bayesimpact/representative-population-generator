# Representative-Population-Generator

## Config
### ECS
We use ECS to deploy our docker images. The following scripts assume that you have the necessary access on AWS to create and update ECS clusters.

### AWS Credentials
- Make sure that your AWS credentials are up to date in ~/.aws/credentials and remember your profile name.
- Install and configure `aws-cli` command line tool with your AWS access keys
- Install `ecs-cli` command line tool
- Create a `.pem` key on AWS and download it to your computer before deploying.

### Mapbox
- Make sure that the environment variable MAPBOX_TOKEN is set up in your bash_profile, or as prefix to your deploy command.
- If you do not have a token yet:
  - Go to the [Mapbox website](https://www.mapbox.com/)
  - Create a new account (it's free)
  - In the main [account dashboard](https://www.mapbox.com/account/) look in the "Access tokens" section for the default public token
  - This is the token to use in your app.

### API URL & Docker Repository
Before your first run, you will need to configure all the necessary variables at the top of the two deploy files:
	deploy/initialize_cluster.sh
	deploy/build_prod_docker.sh

## Deploy

### Standalone Server on AWS

Instructions to run the service on a standalone server on AWS:

- Go on AWS EC2 service
- Create a new Instance
- Choose the basic Linux AMI
- Choose a server size (mostly depending on your traffic)
- Specify a new security group:
  - Name if "representative-population-generator-server-access"
  - Allow SSH from your IP
  - Allow HTTP traffic from everywhere
  - Allow TCP port 8080 traffic from everywhere
- Validate and then check that you have access to the keypair you are selecting (or create a new one)
- Wait for the instance to be created
- Find your newly launched instance and retrieves its IP
- Log in a shell to your instance using its IP, the username "ec2-user" and the private key
- Install Docker: `sudo amazon-linux-extras install docker`
- Install [Docker Compose](https://docs.docker.com/compose/install/#install-compose)
- Start Docker: `sudo service docker start`
- Add user to the docker group: `sudo usermod -a -G docker ec2-user`
- Disconnect and reconnect to the server (to load the new authorizations)
- Update the `start_ec2.sh` file with the `MAPBOX_TOKEN` and `SERVER_IP` values
- Copy the `start_ec2.sh` and `docker-compose-prod.yml` files to the server
- On the server, run `./start_ec2.sh`
- Try it out at `http://<IP of the server>`
- Congrats!

### Initialization
#### AWS ELB (Once Only!)
To ensure that the website address that you have setup and your cluster are always linked, we recommand setting up a new ELB on AWS. The ELB will then be used when initializing the ECS cluster. Once this is done, update the LOAD_BALANCER_NAME variable in `deploy/initialize_cluster.sh`.

### Initialize the ECS cluster (Once Only!)
To create the ECS cluster used to deploy the Docker images, run:

    deploy/dmhc_deploy/initialize_cluster.sh

Note - This only needs to be run once to create the cluster. Once the cluster exists, we can simply redeploy the docker images using the `compose` command below.

#### Security Settings
Depending on your default security settings, you may need to update the access authorisation for your AWS cluster and open ports 80, 8080 and 443.

## Build Docker images and deploy
To update and build and push production Docker files, simply run:

    deploy/build_prod_docker.sh

Once images are created, you will be prompted confirmation before deploying on the representative-population-generator cluster.

## Debugging
If you need to investigate what is happening on the instance, you can ssh into one of the ECS instance.
You can then access logs here: `cat /var/log/ecs/ecs-agent.log.YEAR-MONTH-DAY-HOUR`
