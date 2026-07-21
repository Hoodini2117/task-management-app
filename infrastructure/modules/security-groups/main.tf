# Creates the ALB security group allowing HTTP/HTTPS from the internet
resource "aws_security_group" "alb_sg" {
  name        = "${var.project_name}-${var.environment}-alb-sg"
  description = "Security group for the Application Load Balancer"
  vpc_id      = var.vpc_id

  tags = {
    Name = "${var.project_name}-${var.environment}-alb-sg"
  }
}

# Allows inbound HTTP traffic to ALB
resource "aws_vpc_security_group_ingress_rule" "alb_http" {
  security_group_id = aws_security_group.alb_sg.id
  description       = "Allow HTTP from internet"
  from_port         = 80
  to_port           = 80
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"

  tags = { Name = "alb-http-ingress" }
}

# Allows inbound HTTPS traffic to ALB
resource "aws_vpc_security_group_ingress_rule" "alb_https" {
  security_group_id = aws_security_group.alb_sg.id
  description       = "Allow HTTPS from internet"
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"

  tags = { Name = "alb-https-ingress" }
}

# Allows ALB to forward traffic to application instances
resource "aws_vpc_security_group_egress_rule" "alb_to_app" {
  security_group_id            = aws_security_group.alb_sg.id
  description                  = "Allow traffic to application instances"
  from_port                    = var.app_port
  to_port                      = var.app_port
  ip_protocol                  = "tcp"
  referenced_security_group_id = aws_security_group.app_sg.id

  tags = { Name = "alb-to-app-egress" }
}

# Creates the application security group
resource "aws_security_group" "app_sg" {
  name        = "${var.project_name}-${var.environment}-app-sg"
  description = "Security group for application instances"
  vpc_id      = var.vpc_id

  tags = {
    Name = "${var.project_name}-${var.environment}-app-sg"
  }
}

# Allows inbound traffic from ALB to application instances
resource "aws_vpc_security_group_ingress_rule" "app_from_alb" {
  security_group_id            = aws_security_group.app_sg.id
  description                  = "Allow traffic from ALB"
  from_port                    = var.app_port
  to_port                      = var.app_port
  ip_protocol                  = "tcp"
  referenced_security_group_id = aws_security_group.alb_sg.id

  tags = { Name = "app-from-alb-ingress" }
}

# Allows application instances to reach the internet via NAT
resource "aws_vpc_security_group_egress_rule" "app_to_internet" {
  security_group_id = aws_security_group.app_sg.id
  description       = "Allow outbound internet access for updates"
  ip_protocol       = "-1"
  cidr_ipv4         = "0.0.0.0/0"

  tags = { Name = "app-internet-egress" }
}

# Creates the database security group
resource "aws_security_group" "db_sg" {
  name        = "${var.project_name}-${var.environment}-db-sg"
  description = "Security group for the database"
  vpc_id      = var.vpc_id

  tags = {
    Name = "${var.project_name}-${var.environment}-db-sg"
  }
}

# Allows inbound PostgreSQL traffic from application instances only
resource "aws_vpc_security_group_ingress_rule" "db_from_app" {
  security_group_id            = aws_security_group.db_sg.id
  description                  = "Allow PostgreSQL from application instances"
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
  referenced_security_group_id = aws_security_group.app_sg.id

  tags = { Name = "db-from-app-ingress" }
}
