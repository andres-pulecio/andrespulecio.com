provider "aws" {
  region = "us-east-1"
}

# List all resources with the tag "my-portfolio"
data "aws_vpc" "my_vpc" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

data "aws_subnet" "my_subnet" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

data "aws_security_group" "my_security_group" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

data "aws_ecs_cluster" "my_cluster" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

data "aws_ecs_service" "my_service" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

# Delete ECS service
resource "aws_ecs_service" "my_service_delete" {
  count = length(data.aws_ecs_service.my_service.arns)
  cluster = data.aws_ecs_service.my_service[count.index].cluster_arn
  name    = data.aws_ecs_service.my_service[count.index].service_name

  force_delete = true
  lifecycle {
    create_before_destroy = false
  }
}

# Delete ECS cluster
resource "aws_ecs_cluster" "my_cluster_delete" {
  count = length(data.aws_ecs_cluster.my_cluster.arns)
  cluster_name = data.aws_ecs_cluster.my_cluster[count.index].name

  lifecycle {
    create_before_destroy = false
  }
}

# Delete Security Group
resource "aws_security_group" "my_security_group_delete" {
  count = length(data.aws_security_group.my_security_group.ids)
  security_group_id = data.aws_security_group.my_security_group[count.index].id

  lifecycle {
    create_before_destroy = false
  }
}

# Delete Subnet
resource "aws_subnet" "my_subnet_delete" {
  count = length(data.aws_subnet.my_subnet.ids)
  subnet_id = data.aws_subnet.my_subnet[count.index].id

  lifecycle {
    create_before_destroy = false
  }
}

# Delete VPC
resource "aws_vpc" "my_vpc_delete" {
  count = length(data.aws_vpc.my_vpc.ids)
  vpc_id = data.aws_vpc.my_vpc[count.index].id

  lifecycle {
    create_before_destroy = false
  }
}
