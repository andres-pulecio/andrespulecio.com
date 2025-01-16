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
  subnet_id      = aws_subnet.my-portfolio.id
  route_table_id = aws_route_table.my-portfolio.id
}

# Define a Subnet
resource "aws_subnet" "my-portfolio" {
  vpc_id                  = aws_vpc.my-portfolio.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "my-portfolio"
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

  # Allow inbound traffic on port 3000 for your application
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cid