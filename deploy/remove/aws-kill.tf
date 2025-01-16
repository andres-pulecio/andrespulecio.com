provider "aws" {
  region = "us-east-1"
}

# List all VPCs with the tag "my-portfolio"
data "aws_vpcs" "my_vpcs" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

# List all Subnets with the tag "my-portfolio"
data "aws_subnets" "my_subnets" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

# List all Security Groups with the tag "my-portfolio"
data "aws_security_groups" "my_security_groups" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

# List all ECS Clusters with the tag "my-portfolio"
data "aws_ecs_cluster" "my_cluster" {
  cluster_name = "my-portfolio"
}

# List all ECS Services within the ECS Cluster
data "aws_ecs_service" "my_service" {
  cluster = data.aws_ecs_cluster.my_cluster.id
}

# Delete ECS services
resource "aws_ecs_service" "my_service_delete" {
  count    = length(data.aws_ecs_service.my_service.arns)
  cluster  = data.aws_ecs_service.my_service[count.index].cluster
  name     = data.aws_ecs_service.my_service[count.index].name

  force_delete = true
  lifecycle {
    create_before_destroy = false
  }
}

# Delete ECS clusters
resource "aws_ecs_cluster" "my_cluster_delete" {
  count = length(data.aws_ecs_cluster.my_cluster.ids)
  name  = data.aws_ecs_cluster.my_cluster[count.index].name

  lifecycle {
    create_before_destroy = false
  }
}

# Delete Security Groups
resource "aws_security_group" "my_security_group_delete" {
  count             = length(data.aws_security_groups.my_security_groups.ids)
  security_group_id = data.aws_security_groups.my_security_groups[count.index].id

  lifecycle {
    create_before_destroy = false
  }
}

# Delete Subnets
resource "aws_subnet" "my_subnet_delete" {
  count   = length(data.aws_subnets.my_subnets.ids)
  id      = data.aws_subnets.my_subnets[count.index].id
  vpc_id  = data.aws_vpcs.my_vpcs.ids[0]

  lifecycle {
    create_before_destroy = false
  }
}

# Delete VPCs
resource "aws_vpc" "my_vpc_delete" {
  count = length(data.aws_vpcs.my_vpcs.ids)
  id    = data.aws_vpcs.my_vpcs[count.index].id

  lifecycle {
    create_before_destroy = false
  }
}
