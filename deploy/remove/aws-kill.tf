provider "aws" {
  region = "us-east-1"
}

# List all VPCs with the tag "my-portfolio"
data "aws_vpcs" "my_vpcs" {
  tags = {
    Name = "my-portfolio"
  }
}

# List all Subnets with the tag "my-portfolio"
data "aws_subnets" "my_subnets" {
  tags = {
    Name = "my-portfolio"
  }
}

# List all Security Groups with the tag "my-portfolio"
data "aws_security_groups" "my_security_groups" {
  tags = {
    Name = "my-portfolio"
  }
}

# List all ECS Clusters with the tag "my-portfolio"
data "aws_ecs_clusters" "my_clusters" {
  tags = {
    Name = "my-portfolio"
  }
}

# List all ECS Services within the ECS Cluster with the tag "my-portfolio"
data "aws_ecs_service" "my_services" {
  cluster_arn = data.aws_ecs_clusters.my_clusters.arns[0]
}

# Delete ECS services
resource "aws_ecs_service" "my_service_delete" {
  for_each = toset(data.aws_ecs_service.my_services.arns)
  cluster = data.aws_ecs_service.my_services.cluster_arn
  name    = each.value

  force_delete = true
  lifecycle {
    create_before_destroy = false
  }
}

# Delete ECS clusters
resource "aws_ecs_cluster" "my_cluster_delete" {
  for_each = toset(data.aws_ecs_clusters.my_clusters.arns)
  name = each.value

  lifecycle {
    create_before_destroy = false
  }
}

# Delete Security Groups
resource "aws_security_group" "my_security_group_delete" {
  for_each = toset(data.aws_security_groups.my_security_groups.ids)
  id = each.value

  lifecycle {
    create_before_destroy = false
  }
}

# Delete Subnets
resource "aws_subnet" "my_subnet_delete" {
  for_each = toset(data.aws_subnets.my_subnets.ids)
  id = each.value

  lifecycle {
    create_before_destroy = false
  }
}

# Delete VPCs
resource "aws_vpc" "my_vpc_delete" {
  for_each = toset(data.aws_vpcs.my_vpcs.ids)
  id = each.value

  lifecycle {
    create_before_destroy = false
  }
}
