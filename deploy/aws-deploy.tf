provider "aws" {
  region = "us-east-1"
}

resource "aws_ecs_cluster" "default" {
  name = "my-cluster"
}

resource "aws_ecs_task_definition" "task" {
  family                   = "my-task"
  container_definitions    = jsonencode([
    {
      name  = "my-container",
      image = "YOUR_ECR_IMAGE_URL",
      essential = true,
      memory = 512,
      cpu    = 256,
      portMappings = [{
        containerPort = 80,
        hostPort      = 80,
      }],
    },
  ])
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = "512"
  cpu                      = "256"
}

resource "aws_ecs_service" "service" {
  name            = "my-service"
  cluster         = aws_ecs_cluster.default.id
  task_definition = aws_ecs_task_definition.task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = ["YOUR_SUBNET_ID"]
    security_groups  = ["YOUR_SECURITY_GROUP_ID"]
    assign_public_ip = true
  }
}
