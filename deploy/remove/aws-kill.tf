provider "aws" {
  region = "us-east-1"
}

# List all resources with the tag "my-portfolio"
data "aws_vpcs" "my_vpcs" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

data "aws_subnets" "my_subnets" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

data "aws_security_groups" "my_security_groups" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

data "aws_ecs_clusters" "my_clusters" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

data "aws_ecs_services" "my_services" {
  cluster_arn = data.aws_ecs_clusters.my_clusters.arns[0]
}

# Delete ECS services
resource "aws_ecs_service" "my_service_delete" {
  for_each = toset(data.aws_ecs_services.my_services.arns)
  cluster = data.aws_ecs_services.my_services.cluster_arn
  name    = each.value

  force_delete = true
  lifecycle {
    create_before_destroy = false
  }
}

# Delete ECS clusters
resource "aws_ecs_cluster" "my_cluster_delete" {
  for_each = toset(data.aws_ecs_clusters.my_clusters.arns)
  cluster_name = each.value

  lifecycle {
    create_before_destroy = false
  }
}

# Delete Security Groups
resource "aws_security_group" "my_security_group_delete" {
  for_each = toset(data.aws_security_groups.my_security_groups.ids)
  security_group_id = each.value

  lifecycle {
    create_before_destroy = false
  }
}

# Delete