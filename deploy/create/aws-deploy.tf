# This Terraform configuration sets up an AWS infrastructure for a web application named "my-portfolio".
# It includes a VPC, subnets, an internet gateway, route table, security group, ECS cluster, ECS task
# definition, load balancer, target group, and ECS service.

# Configure the AWS provider
provider "aws" {
  region = "us-east-1"  # Specify the AWS region
}

# Define a VPC
resource "aws_vpc" "my-portfolio" {
  cidr_block           = "10.0.0.0/16"  # IP range for the VPC
  enable_dns_support   = true  # Enable DNS support in the VPC
  enable_dns_hostnames = true  # Enable DNS hostnames in the VPC

  tags = {
    Name = "my-portfolio"  # Tag for the VPC
  }
}

# Define an Internet Gateway
resource "aws_internet_gateway" "my-portfolio" {
  vpc_id = aws_vpc.my-portfolio.id  # Associate the Internet Gateway with the VPC

  tags = {
    Name = "my-portfolio"  # Tag for the Internet Gateway
  }
}

# Define a Route Table
resource "aws_route_table" "my-portfolio" {
  vpc_id = aws_vpc.my-portfolio.id  # Associate the Route Table with the VPC

  route {
    cidr_block = "0.0.0.0/0"  # Route for all IPv4 traffic
    gateway_id = aws_internet_gateway.my-portfolio.id  # Use the Internet Gateway for the route
  }

  tags = {
    Name = "my-portfolio"  # Tag for the Route Table
  }
}

# Associate the Route Table with the Subnet
resource "aws_route_table_association" "my-portfolio" {
  subnet_id      = aws_subnet.my-portfolio-1.id  # Associate the Route Table with Subnet 1
  route_table_id = aws_route_table.my-portfolio.id  # Specify the Route Table ID
}

# Define Subnet 1
resource "aws_subnet" "my-portfolio-1" {
  vpc_id                  = aws_vpc.my-portfolio.id  # Associate the Subnet with the VPC
  cidr_block              = "10.0.1.0/24"  # IP range for Subnet 1
  availability_zone       = "us-east-1a"  # Availability zone for Subnet 1
  map_public_ip_on_launch = true  # Assign a public IP to instances launched in the subnet

  tags = {
    Name = "my-portfolio-1"  # Tag for Subnet 1
  }
}

# Define Subnet 2
resource "aws_subnet" "my-portfolio-2" {
  vpc_id                  = aws_vpc.my-portfolio.id  # Associate the Subnet with the VPC
  cidr_block              = "10.0.2.0/24"  # IP range for Subnet 2
  availability_zone       = "us-east-1b"  # Availability zone for Subnet 2
  map_public_ip_on_launch = true  # Assign a public IP to instances launched in the subnet

  tags = {
    Name = "my-portfolio-2"  # Tag for Subnet 2
  }
}

# Define a Security Group
resource "aws_security_group" "my-portfolio" {
  name        = "my-portfolio"  # Name of the Security Group
  description = "Allow inbound traffic"  # Description of the Security Group
  vpc_id      = aws_vpc.my-portfolio.id  # Associate the Security Group with the VPC

  # Allow inbound traffic on port 443 for HTTPS
  ingress {
    from_port   = 443  # Start of port range
    to_port     = 443  # End of port range
    protocol    = "tcp"  # Protocol to allow
    cidr_blocks = ["0.0.0.0/0"]  # Allow traffic from all IPs
  }

  # Allow inbound traffic on port 80 for HTTP
  ingress {
    from_port   = 80  # Start of port range
    to_port     = 80  # End of port range
    protocol    = "tcp"  # Protocol to allow
    cidr_blocks = ["0.0.0.0/0"]  # Allow traffic from all IPs
  }

  # Allow inbound traffic on port 3000 for your application
  ingress {
    from_port   = 3000  # Start of port range
    to_port     = 3000  # End of port range
    protocol    = "tcp"  # Protocol to allow
    cidr_blocks = ["0.0.0.0/0"]  # Allow traffic from all IPs
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0  # Start of port range
    to_port     = 0  # End of port range
    protocol    = "-1"  # All protocols
    cidr_blocks = ["0.0.0.0/0"]  # Allow traffic to all IPs
  }

  tags = {
    Name = "my-portfolio"  # Tag for the Security Group
  }
}

# Define an ECS cluster
resource "aws_ecs_cluster" "default" {
  name = "my-portfolio"  # Name of the ECS cluster

  tags = {
    Name = "my-portfolio"  # Tag for the ECS cluster
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
    Name = "my-portfolio"  # Tag for the task definition
  }
}

# Define a Load Balancer
resource "aws_lb" "my-portfolio" {
  name               = "my-portfolio"  # Name of the Load Balancer
  internal           = false  # Set to false to create an Internet-facing Load Balancer
  load_balancer_type = "application"  # Specify the Load Balancer type as application
  security_groups    = [aws_security_group.my-portfolio.id]  # Associate the Security Group with the Load Balancer
  subnets            = [aws_subnet.my-portfolio-1.id, aws_subnet.my-portfolio-2.id]  # Associate the Subnets with the Load Balancer

  tags = {
    Name = "my-portfolio"  # Tag for the Load Balancer
  }
}

# Define a Target Group
resource "aws_lb_target_group" "my-portfolio" {
  name        = "my-portfolio"  # Name of the Target Group
  port        = 3000  # Port number for the Target Group
  protocol    = "HTTP"  # Protocol for the Target Group
  vpc_id      = aws_vpc.my-portfolio.id  # Associate the Target Group with the VPC
  target_type = "ip"  # Set target type to "ip" for compatibility with awsvpc network mode

  health_check {
    path                = "/"  # Health check path
    protocol            = "HTTP"  # Health check protocol
    interval            = 30  # Interval for health checks in seconds
    timeout             = 5  # Timeout for health checks in seconds
    healthy_threshold   = 2  # Number of consecutive successes for a target to be considered healthy
    unhealthy_threshold = 2  # Number of consecutive failures for a target to be considered unhealthy
  }

  tags = {
    Name = "my-portfolio"  # Tag for the Target Group
  }
}

# Define a Listener for HTTP
resource "aws_lb_listener" "my-portfolio" {
  load_balancer_arn = aws_lb.my-portfolio.arn  # ARN of the Load Balancer
  port              = "80"  # Port number for the Listener
  protocol          = "HTTP"  # Protocol for the Listener

  default_action {
    type             = "forward"  # Forward traffic to the Target Group
    target_group_arn = aws_lb_target_group.my-portfolio.arn  # ARN of the Target Group
  }

  tags = {
    Name = "my-portfolio"  # Tag for the Listener
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

# Fetch the Route 53 Hosted Zone using the exact name
data "aws_route53_zone" "my-portfolio" {
  name = "andrespulecio.com"  # Nombre exacto de tu zona de hospedaje en Route 53
}

# Define a Route 53 Record
resource "aws_route53_record" "my-portfolio" {
  zone_id = data.aws_route53_zone.my-portfolio.id  # ID de la zona de hospedaje en Route 53
  name    = "andres.com"  # Nombre de dominio
  type    = "A"  # Tipo de registro
  alias {
    name                   = aws_lb.my-portfolio.dns_name  # Nombre DNS del Load Balancer
    zone_id                = aws_lb.my-portfolio.zone_id  # ID de la zona del Load Balancer
    evaluate_target_health = false  # No evaluar la salud del objetivo
  }
}
