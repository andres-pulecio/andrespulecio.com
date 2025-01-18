# Configure the AWS provider
provider "aws" {
  region = "us-east-1"  # Specify the AWS region
}

# Define a VPC
resource "aws_vpc" "my-portfolio" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "my-portfolio"
  }
}

# Define an Internet Gateway
resource "aws_internet_gateway" "my-portfolio" {
  vpc_id = aws_vpc.my-portfolio.id

  tags = {
    Name = "my-portfolio"
  }
}

# Define a Route Table
resource "aws_route_table" "my-portfolio" {
  vpc_id = aws_vpc.my-portfolio.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my-portfolio.id
  }

  tags = {
    Name = "my-portfolio"
  }
}

# Associate the Route Table with the Subnet
resource "aws_route_table_association" "my-portfolio" {
  subnet_id      = aws_subnet.my-portfolio-1.id
  route_table_id = aws_route_table.my-portfolio.id
}

# Define Subnet 1
resource "aws_subnet" "my-portfolio-1" {
  vpc_id                  = aws_vpc.my-portfolio.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "my-portfolio-1"
  }
}

# Define Subnet 2
resource "aws_subnet" "my-portfolio-2" {
  vpc_id                  = aws_vpc.my-portfolio.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "my-portfolio-2"
  }
}

# Define a Security Group
resource "aws_security_group" "my-portfolio" {
  name        = "my-portfolio"
  description = "Allow inbound traffic"
  vpc_id      = aws_vpc.my-portfolio.id

  # Allow inbound traffic on port 443 for HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow inbound traffic on port 80 for HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow inbound traffic on port 3000 for your application
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "my-portfolio"
  }
}

# Define an ECS cluster
resource "aws_ecs_cluster" "default" {
  name = "my-portfolio"  # Name of the ECS cluster

  tags = {
    Name = "my-portfolio"
  }
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

  tags = {
    Name = "my-portfolio"
  }
}

# Define a Load Balancer
resource "aws_lb" "my-portfolio" {
  name               = "my-portfolio"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.my-portfolio.id]
  subnets            = [aws_subnet.my-portfolio-1.id, aws_subnet.my-portfolio-2.id]

  tags = {
    Name = "my-portfolio"
  }
}

# Define a Target Group
resource "aws_lb_target_group" "my-portfolio" {
  name        = "my-portfolio"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.my-portfolio.id
  target_type = "ip"  # Set target type to "ip" for compatibility with awsvpc network mode

  health_check {
    path                = "/"
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = {
    Name = "my-portfolio"
  }
}

# Define a Listener for HTTP
resource "aws_lb_listener" "my-portfolio" {
  load_balancer_arn = aws_lb.my-portfolio.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.my-portfolio.arn
  }

  tags = {
    Name = "my-portfolio"
  }
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
    subnets          = [aws_subnet.my-portfolio-1.id, aws_subnet.my-portfolio-2.id]  # Use the Subnet IDs created
    security_groups  = [aws_security_group.my-portfolio.id]  # Use the Security Group ID created
    assign_public_ip = true  # Assign a public IP to the tasks
  }

  # Attach the Load Balancer
  load_balancer {
    target_group_arn = aws_lb_target_group.my-portfolio.arn
    container_name   = "my-portfolio"
    container_port   = 3000
  }

  tags = {
    Name = "my-portfolio"
  }
}
