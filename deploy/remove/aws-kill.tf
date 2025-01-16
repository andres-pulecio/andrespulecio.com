provider "aws" {
  region = "us-east-1"
}

# List all instances with the tag "my-portfolio"
data "aws_instances" "my_instances" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

# List all security groups with the tag "my-portfolio"
data "aws_security_groups" "my_security_groups" {
  filter {
    name   = "tag:Name"
    values = ["my-portfolio"]
  }
}

# Destroy instances
resource "aws_instance" "my_instance_delete" {
  for_each = toset(data.aws_instances.my_instances.ids)
  id       = each.value

  lifecycle {
    create_before_destroy = false
  }
}

# Destroy security groups
resource "aws_security_group" "my_security_group_delete" {
  for_each = toset(data.aws_security_groups.my_security_groups.ids)
  id       = each.value

  lifecycle {
    create_before_destroy = false
  }
}
