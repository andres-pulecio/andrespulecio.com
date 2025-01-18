# Configure the AWS provider
provider "aws" {
  region = "us-east-1"
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

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

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
  name = "my-portfolio"

  tags = {
    Name = "my-portfolio"
  }
}

# Define an ECS task definition
resource "aws_ecs_task_definition" "task" {
  family                   = "my-portfolio"
  container_definitions    = jsonencode([
    {
      name  = "my-portfolio",
      image = "public.ecr.aws/z6s0c3o0/my-porfolio:latest",
      essential = true,
      memory = 512,
      cpu    = 256,
      portMappings = [{
        containerPort = 3000,
        hostPort      = 3000,
      }],
    },
  ])
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = "512"
  cpu                      = "256"

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
  name     = "my-portfolio"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.my-portfolio.id

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

# Define a Listener
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
  name            = "my-portfolio"
  cluster         = aws_ecs_cluster.default.id
  task_definition = aws_ecs_task_definition.task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.my-portfolio-1.id, aws_subnet.my-portfolio-2.id]
    security_groups  = [aws_security_group.my-portfolio.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.my-portfolio.arn
    container_name   = "my-portfolio"
    container_port   = 3000
  }

  tags = {
    Name = "my-portfolio"
  }
}