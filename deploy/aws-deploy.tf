
# Configure the AWS provider
provider "aws" {
  region = "us-east-1"  # Specify the AWS region
}

# Define a VPC
resource "aws_vpc" "my-portfolio" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}

# Define a Subnet
resource "aws_subnet" "my-portfolio" {
  vpc_id                  = aws_vpc.my-portfolio.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
}

# Define a Security Group
resource "aws_security_group" "my-portfolio" {
  name        = "my-portfolio"
  description = "Allow inbound traffic"
  vpc_id      = aws_vpc.my-portfolio.id

  # Allow inbound traffic
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Define an ECS cluster
resource "aws_ecs_cluster" "default" {
  name = "my-portfolio"  # Name of the ECS cluster
}

# Define an ECS task definition
resource "aws_ecs_task_definition" "task" {
  family                   = "my-portfolio"  # Name of the task definition family
  container_definitions    = jsonencode([
    {
      name  = "my-portfolio",  # Name of the container
      image = "public.ecr.aws/z6s0c3o0/my-porfolio:latest",  # URL of the container image in ECR
      essential = true,  # Specify if the container is essential
      memory = 512,  # Memory allocated to the container
      cpu    = 256,  # CPU units allocated to the container
      portMappings = [{
        containerPort = 3000,  # Port number on the container
        hostPort      = 3000,  # Port number on the host
      }],
    },
  ])
  requires_compatibilities = ["FARGATE"]  # Specify that the task runs on Fargate
  network_mode             = "awsvpc"  # Network mode for the task
  memory                   = "512"  # Memory allocated to the task
  cpu                      = "256"  # CPU units allocated to the task
}

# Define an ECS service
resource "aws_ecs_service" "service" {
  name            = "my-portfolio"  # Name of the ECS service
  cluster         = aws_ecs_cluster.default.id  # ID of the ECS cluster
  task_definition = aws_ecs_task_definition.task.arn  # ARN of the task definition
  desired_count   = 1  # Number of tasks to run
  launch_type     = "FARGATE"  # Specify that the service runs on Fargate

  # Configure the network settings for the service
  network_configuration {
    subnets          = [aws_subnet.my-portfolio.id]  # Use the Subnet ID created
    security_groups  = [aws_security_group.my-portfolio.id]  # Use the Security Group ID created
    assign_public_ip = true  # Assign a public IP to the tasks
  }
}