provider "aws" {
  region = "us-east-1"
}

resource "aws_internet_gateway" "my-portfolio" {
  count = 0
  vpc_id = aws_vpc.my-portfolio.id
}

resource "aws_route_table" "my-portfolio" {
  count = 0
  vpc_id = aws_vpc.my-portfolio.id
}

resource "aws_route_table_association" "my-portfolio" {
  count = 0
  subnet_id      = aws_subnet.my-portfolio-1.id
  route_table_id = aws_route_table.my-portfolio.id
}

resource "aws_subnet" "my-portfolio-1" {
  count = 0
  vpc_id                  = aws_vpc.my-portfolio.id
  cidr_block              = "10.0.1.0/24"
}

resource "aws_subnet" "my-portfolio-2" {
  count = 0
  vpc_id                  = aws_vpc.my-portfolio.id
  cidr_block              = "10.0.2.0/24"
}

resource "aws_security_group" "my-portfolio" {
  count = 0
  name        = "my-portfolio"
  vpc_id      = aws_vpc.my-portfolio.id
}

resource "aws_ecs_task_definition" "task" {
  count = 0
  family = "my-portfolio"
}

resource "aws_lb" "my-portfolio" {
  count = 0
  name = "my-portfolio"
}

resource "aws_lb_target_group" "my-portfolio" {
  count = 0
  name = "my-portfolio"
}

resource "aws_lb_listener" "my-portfolio-https" {
  count = 0
  load_balancer_arn = aws_lb.my-portfolio.arn
  port              = "443"
}

resource "aws_lb_listener" "my-portfolio-http" {
  count = 0
  load_balancer_arn = aws_lb.my-portfolio.arn
  port              = "80"
}

resource "aws_ecs_service" "service" {
  count = 0
  name = "my-portfolio"
}

resource "aws_route53_record" "my-portfolio" {
  count = 0
  zone_id = data.aws_route53_zone.my-portfolio.id
  name    = "andrespulecio.com"
  type    = "A"
}
