# AWS Infrastructure for "my-portfolio" Application

This Terraform configuration sets up an AWS infrastructure for a web application named "my-portfolio". The configuration includes the following resources:

## AWS Provider
- Configures the AWS provider with the specified region.

## VPC (Virtual Private Cloud)
- Defines a VPC with a specified CIDR block, DNS support, and DNS hostnames enabled.

## Internet Gateway
- Defines an Internet Gateway and associates it with the VPC.

## Route Table
- Defines a Route Table and a route that directs all IPv4 traffic to the Internet Gateway.
- Associates the Route Table with a subnet.

## Subnets
- Defines two subnets within the VPC, each in a different availability zone, with public IP addresses assigned on launch.

## Security Group
- Defines a Security Group allowing inbound traffic on ports 443 (HTTPS), 80 (HTTP), and 3000 (application).
- Allows all outbound traffic.

## ECS (Elastic Container Service) Cluster
- Defines an ECS cluster for managing containerized applications.

## ECS Task Definition
- Defines an ECS task definition with container specifications, including image, memory, CPU, and port mappings.
- Specifies that the task runs on Fargate and uses the "awsvpc" network mode.

## Load Balancer
- Defines an Application Load Balancer with security groups and subnets.

## Target Group
- Defines a Target Group for the Load Balancer with health check settings.

## Listener
- Defines a Listener for the Load Balancer to forward HTTP traffic to the Target Group.

## ECS Service
- Defines an ECS service that runs the specified number of tasks on Fargate.
- Configures network settings for the service, including subnets, security groups, and public IP assignment.
- Attaches the Load Balancer to the ECS service.

All resources are tagged with the name "my-portfolio" for easy identification and management.
