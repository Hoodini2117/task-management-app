# Staging environment configuration

project_name = "taskmanager"
environment  = "stage"
aws_region   = "ap-south-1"

# VPC
vpc_cidr                 = "10.1.0.0/16"
public_subnet_cidrs      = ["10.1.1.0/24", "10.1.2.0/24"]
private_app_subnet_cidrs = ["10.1.10.0/24", "10.1.11.0/24"]
private_db_subnet_cidrs  = ["10.1.20.0/24", "10.1.21.0/24"]
availability_zones       = ["ap-south-1a", "ap-south-1b"]

# EC2 / Auto Scaling
instance_type        = "t3.small"
asg_min_size         = 1
asg_max_size         = 2
asg_desired_capacity = 1

# RDS
db_instance_class    = "db.t3.small"
db_name              = "taskmanager"
db_username          = "dbadmin"
db_allocated_storage = 20
db_engine_version    = "16.4"
db_multi_az          = false

# Application
app_port          = 8000
health_check_path = "/"
